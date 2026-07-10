from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0002_alter_category_icon"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="promotion",
            name="url",
        ),
    ]
