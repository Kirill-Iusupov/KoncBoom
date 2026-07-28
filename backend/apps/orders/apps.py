from django.apps import AppConfig


class OrdersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.orders"
    verbose_name = "Заказы"

    def ready(self) -> None:
        # Импорт регистрирует обработчики pre_save/pre_delete из signals.py
        # (возврат stock при отмене/удалении заказа). Импорт внутри ready()
        # обязателен — иначе сигналы не подключатся при старте Django.
        from . import signals  # noqa: F401