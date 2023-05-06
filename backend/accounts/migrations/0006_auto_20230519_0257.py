# Generated by Django 4.2 on 2023-05-19 02:57

from django.db import migrations
import uuid

def gen_uuid(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    for row in User.objects.all():
        row.uuid = uuid.uuid4()
        row.save(update_fields=["uuid"])

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_user_uuid_alter_user_id'),
    ]

    operations = [
        migrations.RunPython(gen_uuid, reverse_code=migrations.RunPython.noop),
    ]
