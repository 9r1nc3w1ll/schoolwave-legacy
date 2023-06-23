# Generated by Django 4.2 on 2023-06-21 16:28

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
                ('username', models.CharField(max_length=200)),
                ('password', models.CharField(max_length=200)),
                ('first_name', models.CharField(max_length=200)),
                ('last_name', models.CharField(max_length=200)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('date_of_birth', models.DateField()),
                ('gender', models.CharField(choices=[('male', 'Male'), ('female', 'Female')], max_length=100)),
                ('blood_group', models.CharField(blank=True, max_length=20, null=True)),
                ('religion', models.CharField(blank=True, max_length=20, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('city', models.CharField(blank=True, max_length=200, null=True)),
                ('state', models.CharField(blank=True, max_length=200, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('guardian_name', models.CharField(blank=True, max_length=200, null=True)),
                ('relation', models.CharField(blank=True, max_length=200, null=True)),
                ('guardian_occupation', models.CharField(blank=True, max_length=200, null=True)),
                ('guardian_phone_number', models.CharField(blank=True, max_length=200, null=True)),
                ('guardian_address', models.TextField(blank=True, null=True)),
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
                ('comment_if_declined', models.TextField(blank=True, null=True)),
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
