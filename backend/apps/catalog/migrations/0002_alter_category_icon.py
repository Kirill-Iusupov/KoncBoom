import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="category",
            name="icon",
            field=models.FileField(
                blank=True,
                default="",
                help_text="SVG, PNG, JPG или WEBP.",
                upload_to="categories/icons/",
                validators=[
                    django.core.validators.FileExtensionValidator(
                        allowed_extensions=["svg", "png", "jpg", "jpeg", "webp"]
                    )
                ],
                verbose_name="Иконка",
            ),
        ),
    ]
