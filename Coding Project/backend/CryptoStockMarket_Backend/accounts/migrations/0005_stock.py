# Generated by Django 5.1.2 on 2024-11-25 22:48

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0004_alter_appuser_id"),
    ]

    operations = [
        migrations.CreateModel(
            name="Stock",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("user_email", models.EmailField(max_length=254)),
                ("ticker", models.CharField(max_length=10)),
                ("quantity", models.PositiveIntegerField()),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("purchased_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "unique_together": {("user_email", "ticker")},
            },
        ),
    ]
