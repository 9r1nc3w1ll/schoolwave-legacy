# Generated by Django 4.2 on 2023-11-24 07:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0004_alter_user_email_alter_user_first_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profilephoto',
            name='file_path',
            field=models.URLField(blank=True, null=True),
        ),
    ]