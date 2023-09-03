# Generated by Django 4.2 on 2023-09-03 15:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('school', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('host', models.CharField(max_length=255)),
                ('file_path', models.CharField(max_length=255)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_files', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'files',
            },
        ),
        migrations.CreateModel(
            name='LessonNote',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('week', models.JSONField()),
                ('topic', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('tag', models.CharField(blank=True, max_length=150, null=True)),
                ('content', models.TextField()),
                ('class_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.class')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_lesson_notes', to=settings.AUTH_USER_MODEL)),
                ('files', models.ManyToManyField(blank=True, related_name='lesson_notes', to='lessonnotes.file')),
                ('last_updated_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='updated_lesson_notes', to=settings.AUTH_USER_MODEL)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
            options={
                'db_table': 'lesson_notes',
            },
        ),
    ]
