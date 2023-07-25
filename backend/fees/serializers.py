from rest_framework import serializers
from fees.models import FeeItem, Transaction, FeeTemplate, Discount, Invoice


class FeeTemplateSerializer(serializers.ModelSerializer):
    school_info = serializers.SerializerMethodField()
    class_info = serializers.SerializerMethodField()
    discount_info = serializers.SerializerMethodField()

    class Meta:
        model = FeeTemplate
        fields = "__all__"

    def get_school_info(self, obj):
        data =  {
                'id': obj.school.id,
                'name': obj.school.name,
            }
        if data:
            return data
        return None

    def get_class_info(self, obj):
        data =  {
                'id': obj.class_id.id,
                'name': obj.class_id.name,
                'description': obj.class_id.description,
                'class_index': obj.class_id.class_index,
                'code': obj.class_id.code,
            }
        if data:
            return data
        return None
    
    def get_discount_info(self, obj):
        data =  {
                'id': obj.discount.id,
                'discount_type': obj.discount.discount_type,
                'amount': obj.discount.amount,
                'percentage': obj.discount.percentage,
            }
        if data:
            return data
        return None


class FeeItemSerializer(serializers.ModelSerializer):
    school_info = serializers.SerializerMethodField()
    discount_info = serializers.SerializerMethodField()

    class Meta:
        model = FeeItem
        fields = "__all__"

    def get_school_info(self, obj):
        data =  {
                'id': obj.school.id,
                'name': obj.school.name,
            }
        if data:
            return data
        return None
    
    def get_discount_info(self, obj):
        data =  {
                'id': obj.discount.id,
                'discount_type': obj.discount.discount_type,
                'amount': obj.discount.amount,
                'percentage': obj.discount.percentage,
            }
        if data:
            return data
        return None


class TransactionSerializer(serializers.ModelSerializer):
    school_info = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = "__all__"

    def get_school_info(self, obj):
        data =  {
                'id': obj.school.id,
                'name': obj.school.name,
            }
        if data:
            return data
        return None


class DiscountSerializer(serializers.ModelSerializer):
    school_info = serializers.SerializerMethodField()

    class Meta:
        model = Discount
        fields = "__all__"

    def get_school_info(self, obj):
        data =  {
                'id': obj.school.id,
                'name': obj.school.name,
            }
        if data:
            return data
        return None


class InvoiceSerializer(serializers.ModelSerializer):
    school_info = serializers.SerializerMethodField()
    template_info = serializers.SerializerMethodField()
    items_info = serializers.SerializerMethodField()
    student_info = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = "__all__"

    def get_school_info(self, obj):
        data =  {
                'id': obj.school.id,
                'name': obj.school.name,
            }
        if data:
            return data
        return None
    
    def get_template_info(self, obj):
        data =  {
                'id': obj.template.id,
                'name': obj.template.name,
            }
        if data:
            return data
        return None
    
    def get_items_info(self, obj):
        data = [
            {
                'id': item.id,
                'name': item.name,
                'description': item.description,
            }
            for item in obj.items.all()  # Loop through each FeeItem in obj.items
        ]
        if data:
            return data
        return None
    

    def get_student_info(self, obj):
        data =  {
                'id': obj.student.id,
                'first_name': obj.student.first_name,
                'last_name': obj.student.last_name,
            }
        if data:
            return data
        return None



class BulkInvoiceSerializer(serializers.Serializer):
    template = serializers.UUIDField()
    items = serializers.ListField(child=serializers.UUIDField())
    

    class Meta:
        fields = "__all__"