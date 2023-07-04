# Generated by Django 4.2 on 2023-07-04 11:18

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('fees', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='invoice',
            name='instance_id',
        ),
        migrations.AddField(
            model_name='invoice',
            name='item_id',
            field=models.UUIDField(default=uuid.uuid4),
        ),
    ]
