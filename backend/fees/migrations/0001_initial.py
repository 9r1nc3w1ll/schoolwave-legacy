# Generated by Django 4.2 on 2023-07-05 00:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('school', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Discount',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('discount_type', models.CharField(default='percentage', max_length=20)),
                ('amount', models.IntegerField(default=0)),
                ('percentage', models.IntegerField(default=10)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
            options={
                'db_table': 'discount',
            },
        ),
        migrations.CreateModel(
            name='FeeItem',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('amount', models.IntegerField(default=0)),
                ('tax', models.IntegerField(default=0)),
                ('discount', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fees.discount')),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
            options={
                'db_table': 'fee_item',
            },
        ),
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('item_id', models.UUIDField(default=uuid.uuid4)),
                ('reversed_invoice_id', models.UUIDField(default=uuid.uuid4)),
                ('status', models.CharField(choices=[('pending', 'pending'), ('paid', 'paid'), ('cancelled', 'cancelled')], default='pending', max_length=20)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
            options={
                'db_table': 'invoice',
            },
        ),
        migrations.CreateModel(
            name='FeeTemplate',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('tax', models.IntegerField(default=0)),
                ('active', models.BooleanField(default=True)),
                ('class_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.class')),
                ('discount', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fees.discount')),
                ('optional_items', models.ManyToManyField(related_name='optional', to='fees.feeitem')),
                ('required_items', models.ManyToManyField(related_name='required', to='fees.feeitem')),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
            options={
                'db_table': 'fee_templates',
            },
        ),
        migrations.CreateModel(
            name='FeePayment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('amount_paid', models.IntegerField(default=0)),
                ('balance', models.IntegerField(default=0)),
                ('outstanding', models.IntegerField(default=0)),
                ('items', models.ManyToManyField(to='fees.feeitem')),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fees.feetemplate')),
            ],
            options={
                'db_table': 'fee_payment',
            },
        ),
    ]
