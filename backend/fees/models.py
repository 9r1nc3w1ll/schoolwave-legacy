from decimal import Decimal
from django.db import models


from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from account.models import User
from school.models import Class, School
from config.models import BaseModel

import uuid

from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver

class Discount(BaseModel):
    class Meta:
        db_table = "discount"
    
    DISCOUNT_TYPE_CHOICES = (
        ('percentage', 'Percentage'),
        ('amount', 'Amount'),
    )

    name = models.CharField(max_length=200)
    description = models.TextField()
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, default='percentage')
    amount = models.IntegerField(default=0, null=True, blank=True)
    percentage = models.IntegerField(default=10, null=True, blank=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)


class FeeItem(BaseModel):
    class Meta:
        db_table = "fee_item"

    name = models.CharField(max_length=200)
    description = models.TextField()
    amount = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE, null=True, blank=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    @property
    def total_amount(self):
        if self.discount:
            if self.discount.discount_type == 'percentage':
                discount_amount = self.amount * self.discount.percentage / 100
            else:
                discount_amount = self.discount.amount

            return self.amount - self.tax - discount_amount
        else:
            return self.amount - self.tax


class FeeTemplate(BaseModel):
    class Meta:
        db_table = "fee_templates"

    name = models.CharField(max_length=200)
    description = models.TextField()
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    required_items = models.ManyToManyField(FeeItem, related_name="required")
    optional_items = models.ManyToManyField(FeeItem, related_name="optional", blank=True)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    tax = models.IntegerField(default=0)
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE, null=True, blank=True)
    active = models.BooleanField(default=True)


class Invoice(BaseModel):
    class Meta:
        db_table = "invoice"

    name = models.CharField(max_length=200)
    description = models.TextField()
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    template = models.ForeignKey(FeeTemplate, on_delete=models.CASCADE)
    amount_paid = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    items = models.ManyToManyField(FeeItem, blank=True)
    balance = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    outstanding_balance = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    student = models.ForeignKey(User, on_delete=models.CASCADE)

    @property
    def total_amount(self):
        return self.items.aggregate(total_amount=models.Sum('amount'))['total_amount'] or 0.00

    def update_invoice(self, amount_paid):
        amount_paid = Decimal(amount_paid)

        self.amount_paid += amount_paid
        self.outstanding_balance = self.total_amount - amount_paid
        self.save()
    
    def calculate_outstanding_balance_on_create(self):
        total_amount = Decimal(0.00)

        for item in self.items.all():
            total_amount += item.amount

        print(total_amount)
        
        self.outstanding_balance = total_amount
        self.save()
        

# Signal to create the Invoice items based on the related FeeTemplate
@receiver(post_save, sender=Invoice)
def create_invoice_items(sender, instance, created, **kwargs):
    if created:
        # Get the required and optional items from the related FeeTemplate
        required_items = instance.template.required_items.all()
        optional_items = instance.template.optional_items.all()

        # Add required items to the Invoice
        instance.items.add(*required_items)

        # Add optional items to the Invoice if they exist
        if optional_items.exists():
            instance.items.add(*optional_items)

# Signal to update the Invoice items when FeeTemplate items are modified
@receiver(m2m_changed, sender=FeeTemplate.required_items.through)
@receiver(m2m_changed, sender=FeeTemplate.optional_items.through)
def update_invoice_items(sender, instance, **kwargs):
    invoices_with_template = Invoice.objects.filter(template=instance)
    for invoice in invoices_with_template:
        required_items = instance.required_items.all()
        optional_items = instance.optional_items.all()

        # Update items in the Invoice
        items_to_add = set(required_items).union(optional_items)
        invoice.items.set(items_to_add)


class Transaction(BaseModel):
    class Meta:
        db_table = "transaction"

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
    payment_type = models.CharField(default="flutterwave", max_length=100)
    payment_category = models.CharField(default="school_fees", max_length=100)
    ref = models.CharField(max_length=200)
    school = models.ForeignKey(School, on_delete=models.CASCADE)