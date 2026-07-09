import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "idempotency_key",
                    models.UUIDField(
                        db_index=True,
                        default=uuid.uuid4,
                        editable=False,
                        unique=True,
                        verbose_name="Ключ идемпотентности",
                    ),
                ),
                ("guest_name", models.CharField(max_length=256, verbose_name="Имя")),
                ("guest_phone", models.CharField(max_length=32, verbose_name="Телефон")),
                ("guest_address", models.TextField(verbose_name="Адрес доставки")),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("new", "Новый"),
                            ("confirmed", "Подтверждён"),
                            ("done", "Выполнен"),
                            ("cancelled", "Отменён"),
                        ],
                        db_index=True,
                        default="new",
                        max_length=16,
                        verbose_name="Статус",
                    ),
                ),
                ("comment", models.TextField(blank=True, default="", verbose_name="Комментарий")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Создан")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="Обновлён")),
            ],
            options={
                "verbose_name": "Заказ",
                "verbose_name_plural": "Заказы",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("quantity", models.PositiveIntegerField(default=1, verbose_name="Количество")),
                (
                    "unit_price",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        verbose_name="Цена за единицу (KGS) на момент заказа",
                    ),
                ),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="items",
                        to="orders.order",
                        verbose_name="Заказ",
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="order_items",
                        to="catalog.product",
                        verbose_name="Товар",
                    ),
                ),
            ],
            options={
                "verbose_name": "Позиция заказа",
                "verbose_name_plural": "Позиции заказа",
            },
        ),
    ]
