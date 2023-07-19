# Generated by Django 4.2 on 2023-07-19 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fees', '0002_transaction_remove_invoice_content_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feeitem',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=50),
        ),
        migrations.AlterField(
            model_name='feeitem',
            name='tax',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=50),
        ),
        migrations.AlterField(
            model_name='invoice',
            name='amount_paid',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=50),
        ),
        migrations.AlterField(
            model_name='invoice',
            name='balance',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=50),
        ),
        migrations.AlterField(
            model_name='invoice',
            name='outstanding_balance',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=50),
        ),
    ]
