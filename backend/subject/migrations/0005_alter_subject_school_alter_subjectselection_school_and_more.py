# Generated by Django 4.2 on 2023-08-19 21:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0004_alter_classmember_school'),
        ('subject', '0004_subject_staff_assignments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subject',
            name='school',
            field=models.ForeignKey(default='6023efc5-3ee7-40a2-81a2-eb42f166ff16', on_delete=django.db.models.deletion.CASCADE, to='school.school'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='subjectselection',
            name='school',
            field=models.ForeignKey(default='6023efc5-3ee7-40a2-81a2-eb42f166ff16', on_delete=django.db.models.deletion.CASCADE, to='school.school'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='subjectstaffassignment',
            name='school',
            field=models.ForeignKey(default='6023efc5-3ee7-40a2-81a2-eb42f166ff16', on_delete=django.db.models.deletion.CASCADE, to='school.school'),
            preserve_default=False,
        ),
    ]
