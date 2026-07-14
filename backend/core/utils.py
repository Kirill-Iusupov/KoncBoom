"""Общие вспомогательные функции проекта."""

from __future__ import annotations

from decimal import Decimal


def format_kgs(value: Decimal | int | float | None) -> str:
    """
    Форматирует сумму в сомах для отображения владельцу магазина.

    1234567 -> '1 234 567 сом' (неразрывные пробелы-разделители тысяч,
    без копеек — в заявках канцелярии дробная часть не нужна).
    """
    amount = Decimal(str(value or 0))
    grouped = f"{amount:,.0f}".replace(",", "\u00a0")
    return f"{grouped}\u00a0сом"