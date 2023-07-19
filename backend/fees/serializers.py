from rest_framework import serializers
from fees.models import FeeItem, FeePayment, FeeTemplate, Discount, Invoice


class FeeTemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeeTemplate
        fields = "__all__"


class FeeItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeeItem
        fields = "__all__"


class FeePaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeePayment
        fields = "__all__"


class DiscountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Discount
        fields = "__all__"


class InvoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Invoice
        fields = "__all__"