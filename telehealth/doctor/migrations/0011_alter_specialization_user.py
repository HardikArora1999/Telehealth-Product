# Generated by Django 3.2.3 on 2021-06-02 15:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('doctor', '0010_profile_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='specialization',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='specialization', to=settings.AUTH_USER_MODEL),
        ),
    ]
