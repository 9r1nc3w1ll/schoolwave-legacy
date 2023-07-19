from rest_framework import serializers
from fees.models import FeeItem, Transaction, FeeTemplate, Discount, Invoice


class FeeTemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeeTemplate
        fields = "__all__"


class FeeItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeeItem
        fields = "__all__"


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = "__all__"


class DiscountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Discount
        fields = "__all__"


class InvoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Invoice
        fields = "__all__"


class BulkInvoiceSerializer(serializers.Serializer):
    template = serializers.UUIDField()
    items = serializers.ListField(child=serializers.UUIDField())
    

    class Meta:
        fields = "__all__"