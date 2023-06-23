from django.db import models

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from account.models import User
from school.models import Class, School
from config.models import BaseModel



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
    amount = models.IntegerField(default=0)
    tax = models.IntegerField(default=0)
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


class FeePayment(BaseModel):
    class Meta:
        db_table = "fee_payment"

    school = models.ForeignKey(School, on_delete=models.CASCADE)
    template = models.ForeignKey(FeeTemplate, on_delete=models.CASCADE)
    amount_paid = models.IntegerField(default=0)
    items = models.ManyToManyField(FeeItem)
    balance = models.IntegerField(default=0)
    outstanding = models.IntegerField(default=0)
    student = models.ForeignKey(User, on_delete=models.CASCADE)


class Invoice(BaseModel):
    class Meta:
        db_table = "invoice"

    INVOICE_STATUSES = (
        ("pending", "pending"),
        ("paid", "paid"),
        ("cancelled", "cancelled")
    )

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    instance_id = models.PositiveIntegerField()
    instance = GenericForeignKey("content_type", "instance_id")
    reversed_invoice_id = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(default="pending", max_length=20, choices=INVOICE_STATUSES)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
