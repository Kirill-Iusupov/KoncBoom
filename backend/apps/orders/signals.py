"""
Сигналы заказов: возврат stock при отмене или удалении заказа.

Почему сигналы, а не переопределение Order.save()/delete():
  - Bulk-действие Django Admin «Удалить выбранные» вызывает
    QuerySet.delete(), которое НЕ вызывает переопределённый
    Model.delete() для каждого объекта (это самостоятельная
    оптимизация Django — прямой SQL DELETE), но ВСЕГДА посылает
    pre_delete/post_delete сигналы для каждого удаляемого объекта.
    Сигнал — единственный надёжный хук, срабатывающий и при обычном
    удалении со страницы объекта, и при массовом удалении из списка.
  - list_editable в админке (быстрая смена статуса прямо в списке
    заказов) вызывает instance.save() индивидуально для каждой
    изменённой строки — pre_save сигнал ловит это так же, как
    и сохранение через форму на странице заказа.

Идемпотентность:
  - stock_restored на Order — защита от двойного возврата (например,
    заказ сперва отменили, потом ещё и удалили: stock должен вернуться
    один раз, а не дважды).
"""

from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver

from .models import Order
from .services import restore_stock_for_order


@receiver(pre_save, sender=Order)
def restore_stock_on_cancel(sender, instance: Order, **kwargs) -> None:
    """Возвращает stock при переходе заказа в статус 'Отменён'."""
    if not instance.pk:
        return  # новый заказ — восстанавливать нечего

    if instance.stock_restored:
        return  # уже восстановлено ранее

    try:
        old = Order.objects.get(pk=instance.pk)
    except Order.DoesNotExist:
        return  # старой записи нет — нечего сравнивать

    became_cancelled = (
        old.status != Order.Status.CANCELLED
        and instance.status == Order.Status.CANCELLED
    )
    if not became_cancelled:
        return

    restore_stock_for_order(instance)

    # Флаг выставляем прямо на instance (не через отдельный .save() —
    # вызов save() изнутри pre_save того же instance опасен, может
    # привести к рекурсии). Django подхватит новое значение поля
    # в том же UPDATE, который выполнится сразу после этого сигнала.
    instance.stock_restored = True


@receiver(pre_delete, sender=Order)
def restore_stock_on_delete(sender, instance: Order, **kwargs) -> None:
    """Возвращает stock при удалении заказа (если ещё не было возвращено)."""
    if instance.stock_restored:
        return
    restore_stock_for_order(instance)