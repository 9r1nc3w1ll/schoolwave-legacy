# Generated by Django 4.2 on 2023-08-09 10:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0002_classmember_school_alter_school_owner'),
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='school',
            field=models.ForeignKey(default='12d8e90b-f7b0-4ab8-b826-2d3940e38c70', on_delete=django.db.models.deletion.CASCADE, to='school.school'),
            preserve_default=False,
        ),
    ]
