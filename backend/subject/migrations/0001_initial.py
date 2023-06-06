# Generated by Django 4.2 on 2023-06-05 16:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('term', models.CharField(max_length=255)),
                ('class_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.class')),
            ],
            options={
                'db_table': 'subject',
            },
        ),
        migrations.CreateModel(
            name='SubjectSelection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('term', models.CharField(max_length=255)),
                ('score', models.DecimalField(decimal_places=2, max_digits=5)),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subject.subject')),
            ],
            options={
                'db_table': 'subject selection',
            },
        ),
    ]
