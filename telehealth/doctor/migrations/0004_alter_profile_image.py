# Generated by Django 3.2.3 on 2021-05-29 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doctor', '0003_alter_profile_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='image',
            field=models.BinaryField(blank=True),
        ),
    ]
