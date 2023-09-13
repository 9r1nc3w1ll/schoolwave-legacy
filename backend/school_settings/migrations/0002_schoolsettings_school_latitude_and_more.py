# Generated by Django 4.2 on 2023-09-13 04:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('school_settings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='schoolsettings',
            name='school_latitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='schoolsettings',
            name='school_longitude',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='schoolsettings',
            name='school_radius',
            field=models.DecimalField(blank=True, decimal_places=2, default=250, max_digits=7, null=True),
        ),
    ]
