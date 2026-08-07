"""Общие вспомогательные функции проекта."""

from __future__ import annotations

from decimal import ROUND_HALF_UP, Decimal


def format_kgs(value: Decimal | int | float | None) -> str:
    """
    Форматирует сумму в сомах для отображения владельцу магазина.

    1234567 -> '1 234 567 сом' (неразрывные пробелы-разделители тысяч,
    без копеек — в заявках канцелярии дробная часть не нужна).
    """
    amount = Decimal(str(value or 0))
    grouped = f"{amount:,.0f}".replace(",", "\u00a0")
    return f"{grouped}\u00a0сом"


def calc_discounted_price(price: Decimal, discount_percent: int) -> Decimal:
    """
    Применяет процентную скидку к цене.

    Живёт в core/utils, а не в моделях, намеренно: этой функцией пользуются
    и apps.catalog.models (Product.current_price), и apps.catalog.pricing
    (движок расчёта корзины). Если положить её в models.py — pricing.py
    импортирует models, models импортирует pricing, получится циклический
    импорт. Здесь функция чисто арифметическая, ничего не импортирует
    из приложений.

    Округление ROUND_HALF_UP — обычное «школьное» округление для денег,
    а не банковское к чётному (ROUND_HALF_EVEN, дефолт в Decimal).
    """
    if discount_percent <= 0:
        return price

    multiplier = (Decimal("100") - Decimal(discount_percent)) / Decimal("100")
    discounted = price * multiplier
    return discounted.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)