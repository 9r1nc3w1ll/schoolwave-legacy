# Generated by Django 4.2 on 2023-08-25 14:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('parent', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='family',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='parent.familyrole'),
        ),
    ]
