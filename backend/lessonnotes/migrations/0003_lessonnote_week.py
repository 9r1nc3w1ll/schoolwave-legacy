# Generated by Django 4.2 on 2023-10-05 06:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lessonnotes', '0002_remove_lessonnote_week_lessonnote_subject_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='lessonnote',
            name='week',
            field=models.CharField(default='Week 1', max_length=200),
        ),
    ]
