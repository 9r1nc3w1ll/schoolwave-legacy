# Generated by Django 4.2 on 2023-08-22 06:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fees', '0003_merge_20230728_2205'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='ref',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
    ]
