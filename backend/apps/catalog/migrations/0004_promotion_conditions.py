import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0003_remove_promotion_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="promotion",
            name="condition_type",
            field=models.CharField(
                choices=[
                    ("always", "Обычная (только по датам)"),
                    ("min_quantity", "От количества товара"),
                    ("requires_product", "При покупке другого товара"),
                ],
                db_index=True,
                # Существующие акции становятся обычными — поведение
                # для уже созданных записей не меняется.
                default="always",
                help_text="От типа зависит, какие поля ниже нужно заполнить.",
                max_length=32,
                verbose_name="Тип акции",
            ),
        ),
        migrations.AddField(
            model_name="promotion",
            name="min_quantity",
            field=models.PositiveIntegerField(
                blank=True,
                help_text='Только для типа "От количества товара". Например: 10.',
                null=True,
                verbose_name="Минимальное количество",
            ),
        ),
        migrations.AddField(
            model_name="promotion",
            name="required_product",
            field=models.ForeignKey(
                blank=True,
                help_text='Только для типа "При покупке другого товара".',
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="required_by_promotions",
                to="catalog.product",
                verbose_name="Требуемый товар",
            ),
        ),
        migrations.AddField(
            model_name="promotion",
            name="required_quantity",
            field=models.PositiveIntegerField(
                default=1,
                help_text="Сколько штук требуемого товара должно быть в корзине.",
                verbose_name="Количество требуемого товара",
            ),
        ),
        migrations.AlterField(
            model_name="promotion",
            name="discount",
            field=models.PositiveSmallIntegerField(
                default=0,
                help_text="Целое число от 1 до 100.",
                validators=[django.core.validators.MaxValueValidator(100)],
                verbose_name="Скидка (%)",
            ),
        ),
    ]