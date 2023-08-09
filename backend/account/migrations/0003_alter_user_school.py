# Generated by Django 4.2 on 2023-08-09 12:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0002_classmember_school_alter_school_owner'),
        ('account', '0002_user_school'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='school.school'),
        ),
    ]
