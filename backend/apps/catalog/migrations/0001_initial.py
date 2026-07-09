from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies: list = []

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=128, verbose_name="Название")),
                ("slug", models.SlugField(max_length=128, unique=True, verbose_name="Slug")),
                ("description", models.TextField(blank=True, default="", verbose_name="Описание")),
                ("icon", models.CharField(blank=True, default="", max_length=64, verbose_name="Иконка")),
            ],
            options={
                "verbose_name": "Категория",
                "verbose_name_plural": "Категории",
                "ordering": ["title"],
            },
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("brand", models.CharField(max_length=128, verbose_name="Бренд")),
                ("title", models.CharField(max_length=256, verbose_name="Название")),
                ("slug", models.SlugField(max_length=256, unique=True, verbose_name="Slug")),
                (
                    "price",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        verbose_name="Цена (KGS)",
                    ),
                ),
                (
                    "image",
                    models.ImageField(
                        blank=True,
                        default="",
                        upload_to="products/",
                        verbose_name="Изображение",
                    ),
                ),
                ("popular", models.BooleanField(default=False, verbose_name="Популярный")),
                ("stock", models.PositiveIntegerField(default=0, verbose_name="Остаток на складе")),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="products",
                        to="catalog.category",
                        verbose_name="Категория",
                    ),
                ),
            ],
            options={
                "verbose_name": "Товар",
                "verbose_name_plural": "Товары",
                "ordering": ["-popular", "title"],
            },
        ),
        migrations.CreateModel(
            name="Promotion",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("eyebrow", models.CharField(blank=True, default="", max_length=128, verbose_name="Надпись над заголовком (eyebrow)")),
                ("title", models.CharField(max_length=256, verbose_name="Заголовок акции")),
                ("description", models.TextField(blank=True, default="", verbose_name="Описание акции")),
                ("discount", models.PositiveSmallIntegerField(default=0, verbose_name="Скидка (%)")),
                ("url", models.CharField(blank=True, default="", max_length=256, verbose_name="Ссылка на страницу акции")),
                ("starts_at", models.DateTimeField(verbose_name="Начало акции")),
                ("ends_at", models.DateTimeField(verbose_name="Конец акции")),
                (
                    "product",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="promotion",
                        to="catalog.product",
                        verbose_name="Товар",
                    ),
                ),
            ],
            options={
                "verbose_name": "Акция",
                "verbose_name_plural": "Акции",
            },
        ),
        # CHECK constraint на уровне БД: stock не может уйти в минус.
        # Это второй рубеж защиты после F('stock') - qty в транзакции заказа.
        # PostgreSQL отклонит UPDATE если stock опустится ниже нуля,
        # даже при одновременных запросах (защита от race condition).
        migrations.RunSQL(
            sql="ALTER TABLE catalog_product ADD CONSTRAINT stock_non_negative CHECK (stock >= 0);",
            reverse_sql="ALTER TABLE catalog_product DROP CONSTRAINT stock_non_negative;",
        ),
    ]
