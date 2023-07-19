from django.urls import path
from .views import ListCreateDiscount, RetrieveUpdateDestoryDiscount, ListCreateFeeItem, RetrieveUpdateDestoryFeeItem,\
ListCreateFeePayment, RetrieveUpdateDestoryFeePayment, ListCreateFeeTemplate, RetrieveUpdateDestoryFeeTemplate, \
ListCreateInvoice, RetrieveUpdateDestoryInvoice

urlpatterns = [
    path("/discount", ListCreateDiscount.as_view(), name="list_create_discount"),
    path("/discount/<uuid:pk>", RetrieveUpdateDestoryDiscount.as_view(), name="retrieve_update_destroy_discount"),
    path("/fee_item", ListCreateFeeItem.as_view(), name="list_create_fee_item"),
    path("/fee_item/<uuid:pk>", RetrieveUpdateDestoryFeeItem.as_view(), name="retrieve_update_destroy_fee_item"),
    path("/fee_payment", ListCreateFeePayment.as_view(), name="list_create_fee_payment"),
    path("/fee_payment/<uuid:pk>", RetrieveUpdateDestoryFeePayment.as_view(), name="retrieve_update_destroy_fee_payment"),
    path("/fee_template", ListCreateFeeTemplate.as_view(), name="list_create_fee_template"),
    path("/fee_template/<uuid:pk>", RetrieveUpdateDestoryFeeTemplate.as_view(), name="retrieve_update_destroy_fee_template"),
    path("/invoice", ListCreateInvoice.as_view(), name="list_create_invoice"),
    path("/invoice/<uuid:pk>", RetrieveUpdateDestoryInvoice.as_view(), name="retrieve_update_destroy_invoice"),
]