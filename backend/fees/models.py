from django.db import models

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from account.models import User
from school.models import Class, School
from config.models import BaseModel

import uuid



class Discount(BaseModel):
    class Meta:
        db_table = "discount"
    
    discount_type = models.CharField(max_length=20, default="percentage")
    amount = models.IntegerField(default=0)
    percentage = models.IntegerField(default=10)
    school = models.ForeignKey(School, on_delete=models.CASCADE)


class FeeItem(BaseModel):
    class Meta:
        db_table = "fee_item"

    name = models.CharField(max_length=200)
    description = models.TextField()
    amount = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)


class FeeTemplate(BaseModel):
    class Meta:
        db_table = "fee_templates"

    school = models.ForeignKey(School, on_delete=models.CASCADE)
    required_items = models.ManyToManyField(FeeItem, related_name="required")
    optional_items = models.ManyToManyField(FeeItem, related_name="optional")
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    tax = models.IntegerField(default=0)
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)


class Invoice(BaseModel):
    class Meta:
        db_table = "invoice"

    school = models.ForeignKey(School, on_delete=models.CASCADE)
    template = models.ForeignKey(FeeTemplate, on_delete=models.CASCADE)
    amount_paid = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    items = models.ManyToManyField(FeeItem)
    balance = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    outstanding_balance = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    student = models.ForeignKey(User, on_delete=models.CASCADE)


class Transaction(BaseModel):
    class Meta:
        db_table = "transactions"

    TRANSACTION_STATUSES = (
        ("pending", "pending"),
        ("paid", "paid"),
        ("cancelled", "cancelled"),
    )

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    invoice_id = models.UUIDField(default=uuid.uuid4)
    invoice = GenericForeignKey("content_type", "invoice_id")
    reversed_transaction_id = models.UUIDField(default=uuid.uuid4)
    status = models.CharField(default="pending", max_length=20, choices=TRANSACTION_STATUSES)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
