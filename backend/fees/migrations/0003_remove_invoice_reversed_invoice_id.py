# Generated by Django 4.2 on 2023-07-04 11:24

from django.db import migrations, models
import uuid

class Migration(migrations.Migration):

    dependencies = [
        ('fees', '0002_remove_invoice_instance_id_invoice_item_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='invoice',
            name='reversed_invoice_id',
        ),
        migrations.AddField(
            model_name='invoice',
            name='reversed_invoice_id',
            field=models.UUIDField(default=uuid.uuid4),
        ),
    ]
