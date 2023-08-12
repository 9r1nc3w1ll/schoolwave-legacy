from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from account.models import User
from account.serializers import OwnerSerializer, UserSerializer
from school.models import School, Class, ClassMember
from fees.models import FeeItem, Transaction, FeeTemplate, Discount, Invoice
from fees.serializers import BulkInvoiceSerializer, FeeItemSerializer, TransactionSerializer, DiscountSerializer, \
    FeeTemplateSerializer, InvoiceSerializer
from utils.permissions import IsSchoolOwner


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
