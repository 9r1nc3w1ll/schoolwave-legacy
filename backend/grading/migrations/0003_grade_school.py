# Generated by Django 4.2 on 2023-08-09 13:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0002_classmember_school_alter_school_owner'),
        ('grading', '0002_result_school'),
    ]

    operations = [
        migrations.AddField(
            model_name='grade',
            name='school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='school.school'),
            preserve_default=False,
        ),
    ]