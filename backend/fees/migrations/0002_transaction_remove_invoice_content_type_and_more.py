# Generated by Django 4.2 on 2023-07-19 13:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('school', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fees', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('invoice_id', models.UUIDField(default=uuid.uuid4)),
                ('reversed_transaction_id', models.UUIDField(default=uuid.uuid4)),
                ('status', models.CharField(choices=[('pending', 'pending'), ('paid', 'paid'), ('cancelled', 'cancelled')], default='pending', max_length=20)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
            options={
                'db_table': 'transactions',
            },
        ),
        migrations.RemoveField(
            model_name='invoice',
            name='content_type',
        ),
        migrations.RemoveField(
            model_name='invoice',
            name='item_id',
        ),
        migrations.RemoveField(
            model_name='invoice',
            name='reversed_invoice_id',
        ),
        migrations.RemoveField(
            model_name='invoice',
            name='status',
        ),
        migrations.AddField(
            model_name='invoice',
            name='amount_paid',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5),
        ),
        migrations.AddField(
            model_name='invoice',
            name='balance',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5),
        ),
        migrations.AddField(
            model_name='invoice',
            name='items',
            field=models.ManyToManyField(to='fees.feeitem'),
        ),
        migrations.AddField(
            model_name='invoice',
            name='outstanding_balance',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5),
        ),
        migrations.AddField(
            model_name='invoice',
            name='student',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='invoice',
            name='template',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='fees.feetemplate'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='feeitem',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5),
        ),
        migrations.AlterField(
            model_name='feeitem',
            name='tax',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5),
        ),
        migrations.DeleteModel(
            name='FeePayment',
        ),
    ]
