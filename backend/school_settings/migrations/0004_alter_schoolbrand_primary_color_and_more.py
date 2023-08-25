# Generated by Django 4.2 on 2023-08-25 04:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('school_settings', '0003_alter_schoolbrand_options_alter_schoolbrand_table'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schoolbrand',
            name='primary_color',
            field=models.CharField(blank=True, default='#FFFFFF', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='schoolbrand',
            name='secondary_color',
            field=models.CharField(blank=True, default='#000000', max_length=50, null=True),
        ),
    ]
