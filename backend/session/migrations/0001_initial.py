# Generated by Django 4.2 on 2023-09-03 15:45

from django.db import migrations, models
import django.db.models.deletion
import partial_date.fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('name', models.CharField(max_length=50)),
                ('active', models.BooleanField(null=True)),
                ('start_date', partial_date.fields.PartialDateField(verbose_name='%Y')),
                ('end_date', partial_date.fields.PartialDateField(verbose_name='%Y')),
                ('resumption_date', models.DateField()),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
            options={
                'db_table': 'sessions',
                'unique_together': {('school', 'name', 'active')},
            },
        ),
        migrations.CreateModel(
            name='Term',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('name', models.CharField(max_length=50)),
                ('active', models.BooleanField(null=True)),
                ('code', models.CharField(max_length=150, unique=True)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='session.session')),
            ],
            options={
                'db_table': 'terms',
                'unique_together': {('session', 'name', 'active')},
            },
        ),
    ]
