# Generated by Django 4.2 on 2023-08-12 21:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0003_alter_classmember_school'),
        ('attendance', '0002_attendancerecord_school'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendancerecord',
            name='school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='school.school'),
            preserve_default=False,
        ),
    ]
