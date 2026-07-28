from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="stock_restored",
            field=models.BooleanField(
                default=False,
                editable=False,
                help_text="Внутренний флаг: stock уже был возвращён при отмене/удалении.",
                verbose_name="Остаток возвращён",
            ),
        ),
    ]