# Generated by Django 4.2 on 2023-07-26 22:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admission', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentinformation',
            name='password',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
