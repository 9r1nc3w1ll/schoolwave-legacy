# Generated by Django 4.2 on 2023-05-31 03:25

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentInformation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('first_name', models.CharField(max_length=200)),
                ('last_name', models.CharField(max_length=200)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('date_of_birth', models.DateField()),
                ('gender', models.CharField(choices=[('male', 'Male'), ('female', 'Female')], max_length=100)),
            ],
            options={
                'ordering': ['created_at'],
                'get_latest_by': '-created_at',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AdmissionRequest',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('status', models.CharField(choices=[('approved', 'Approved'), ('denied', 'Denied'), ('pending', 'Pending')], default='pending', max_length=100)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
                ('student_info', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='admission.studentinformation')),
            ],
            options={
                'ordering': ['created_at'],
                'get_latest_by': '-created_at',
                'abstract': False,
            },
        ),
    ]
