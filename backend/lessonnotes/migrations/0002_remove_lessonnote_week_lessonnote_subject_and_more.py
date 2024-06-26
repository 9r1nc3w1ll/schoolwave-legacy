# Generated by Django 4.2 on 2023-10-04 10:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('subject', '0001_initial'),
        ('session', '0002_alter_session_end_date_alter_session_start_date'),
        ('lessonnotes', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lessonnote',
            name='week',
        ),
        migrations.AddField(
            model_name='lessonnote',
            name='subject',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='subject.subject'),
        ),
        migrations.AddField(
            model_name='lessonnote',
            name='term',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='session.term'),
        ),
    ]
