# Generated by Django 4.2 on 2023-08-09 10:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0002_classmember_school_alter_school_owner'),
        ('exam', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='school.school'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='exam',
            name='school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='school.school'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='school.school'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='questionoption',
            name='school',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='school.school'),
            preserve_default=False,
        ),
    ]