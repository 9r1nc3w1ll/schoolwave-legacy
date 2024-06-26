# Generated by Django 4.2 on 2023-11-20 08:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('lessonnotes', '0005_alter_file_file_path'),
    ]

    operations = [
        migrations.CreateModel(
            name='LessonNoteFile',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('file_path', models.FileField(blank=True, null=True, upload_to='lesson_notes')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_files', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'lesson_note_files',
            },
        ),
        migrations.DeleteModel(
            name='File',
        ),
        migrations.AlterField(
            model_name='lessonnote',
            name='files',
            field=models.ManyToManyField(blank=True, related_name='lesson_notes', to='lessonnotes.lessonnotefile'),
        ),
    ]
