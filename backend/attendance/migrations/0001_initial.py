# Generated by Django 4.2 on 2023-06-02 09:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('school', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentAttendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('start_time', models.TimeField(blank=True, null=True)),
                ('end_time', models.TimeField(blank=True, null=True)),
                ('attendance_type', models.CharField(choices=[('Daily', 'Daily'), ('Class', 'Class')], max_length=10)),
                ('present', models.BooleanField()),
                ('remark', models.TextField()),
                ('class_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.class')),
                ('staff', models.ForeignKey(limit_choices_to={'role': 'staff'}, on_delete=django.db.models.deletion.CASCADE, related_name='staff_attendances', to=settings.AUTH_USER_MODEL)),
                ('student', models.ForeignKey(limit_choices_to={'role': 'student'}, on_delete=django.db.models.deletion.CASCADE, related_name='student_attendances', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
