from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from account.models import User
from account.serializers import OwnerSerializer, UserSerializer
from django.contrib.contenttypes.models import ContentType
from school.models import School, Class, ClassMember
from fees.models import FeeItem, Transaction, FeeTemplate, Discount, Invoice
from fees.serializers import BulkInvoiceSerializer, FeeItemSerializer, PaymentSerializer, TransactionSerializer, DiscountSerializer, \
    FeeTemplateSerializer, InvoiceSerializer
from utils.permissions import IsSchoolOwner
from utils.flutterwave import verify_flutterwave_tx, generate_random_number


class ListCreateFeeTemplate(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = FeeTemplate.objects.all()
    serializer_class = FeeTemplateSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
            "status": "success",
            "message": "FeeTemplate created successfully.",
            "data": serializer.data,
        }
        return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "status": "success",
            "message": "FeeTemplates fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class RetrieveUpdateDestroyFeeTemplate(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = FeeTemplate.objects.all()
    serializer_class = FeeTemplateSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
            "status": "success",
            "message": "Fee template fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        resp = {
            "status": "success",
            "message": "Fee template updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "status": "success",
            "message": "Fee template updated successfully.",
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)


class ListCreateFeeItem(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = FeeItem.objects.all()
    serializer_class = FeeItemSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
            "status": "success",
            "message": "FeeItem created successfully.",
            "data": serializer.data,
        }
        return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "status": "success",
            "message": "FeeItems fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class RetrieveUpdateDestroyFeeItem(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = FeeItem.objects.all()
    serializer_class = FeeItemSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
            "status": "success",
            "message": "Fee item fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        resp = {
            "status": "success",
            "message": "Fee item updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "status": "success",
            "message": "Fee item deleted successfully.",
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)


class ListCreateDiscount(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
            "status": "success",
            "message": "Discount created successfully.",
            "data": serializer.data,
        }
        return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "status": "success",
            "message": "Discounts fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class RetrieveUpdateDestroyDiscount(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
            "status": "success",
            "message": "Discount fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        resp = {
            "status": "success",
            "message": "Discount updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "status": "success",
            "message": "Discount deleted successfully.",
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)



class ListCreateTransaction(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
            "status": "success",
            "message": "Transaction created successfully.",
            "data": serializer.data,
        }
        return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "status": "success",
            "message": "Transactions fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class RetrieveUpdateDestroyTransaction(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
            "status": "success",
            "message": "Transaction fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        resp = {
            "status": "success",
            "message": "Transaction updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "status": "success",
            "message": "Transaction deleted successfully.",
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)


class BulkCreateInvoice(GenericAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Invoice.objects.all()
    serializer_class = BulkInvoiceSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs
    
    def post(self, request, *args, **kwargs):
        class_id = self.kwargs.get("class_id")


        class_members = ClassMember.objects.filter(class_id_id=class_id)

        school = School.objects.get(owner=self.request.user)

        serializer = BulkInvoiceSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        for student in class_members:
            invoice = Invoice.objects.create(
                school=school,
                template_id=serializer.validated_data["template"],
                student=student.user
            )

            invoice.items.set(serializer.validated_data["items"])

            invoice.save()


        resp = {
            "status": "success",
            "message": "Invoices created successfully.",
            "data": serializer.data,
        }
        return Response(resp, status=status.HTTP_201_CREATED)
        



class ListCreateInvoice(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
            "status": "success",
            "message": "Invoice created successfully.",
            "data": serializer.data,
        }
        return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "status": "success",
            "message": "Invoices fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class RetrieveUpdateDestroyInvoice(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
            "status": "success",
            "message": "Invoice fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        resp = {
            "status": "success",
            "message": "Invoice updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "status": "success",
            "message": "Invoice deleted successfully.",
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)


class UpdateInvoice(GenericAPIView):
    permission_classes = [IsAuthenticated,]
    serializer_class = PaymentSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        
        invoice_id = request.data.get("invoice_id", "")
        ref = request.data.get("tx_ref", "")

        school_id = request.data.get("school_id", "")

        tx_status, tx_data = verify_flutterwave_tx(ref)

        invoice = Invoice.objects.filter(id=invoice_id)
        school = School.objects.filter(id=school_id)

        if not invoice.exists():
            return Response({"error" : "Invoice does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not school.exists():
            return Response({"error" : "School does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        if tx_status == "success":
            content_type = ContentType.objects.get_for_model(Invoice).id
            tx = Transaction.objects.create(
                content_type=content_type,
                invoice=invoice[0],
                status="paid",
                ref=ref,
                school=school
            )
            tx.save()

            return Response({"message" : "Transaction successful."}, status=status.HTTP_400_BAD_REQUEST)
        
        elif tx_status == "pending":
            tx = Transaction.objects.create(
                content_type=content_type,
                invoice=invoice[0],
                ref=ref,
                school=school
            )
            tx.save()

            return Response({"message" : "Transaction has not been confirmed."}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({"error" : "Transaction failed, or invalid transaction id."}, status=status.HTTP_400_BAD_REQUEST)