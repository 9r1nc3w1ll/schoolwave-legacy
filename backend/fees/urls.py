from django.urls import path
from fees.views import (
    ListCreateDiscount, RetrieveUpdateDestroyDiscount, ListCreateFeeItem,
    RetrieveUpdateDestroyFeeItem, ListCreateTransaction, RetrieveUpdateDestroyTransaction,
    ListCreateFeeTemplate, RetrieveUpdateDestroyFeeTemplate, ListCreateInvoice, 
    RetrieveUpdateDestroyInvoice, BulkCreateInvoice, ProcessInvoice, RetrieveInvoiceAPIView)


urlpatterns = [
    path("/discount", ListCreateDiscount.as_view(), name="list_create_discount"),
    path("/discount/<uuid:pk>", RetrieveUpdateDestroyDiscount.as_view(), name="retrieve_update_destroy_discount"),
    path("/fee_item", ListCreateFeeItem.as_view(), name="list_create_fee_item"),
    path("/fee_item/<uuid:pk>", RetrieveUpdateDestroyFeeItem.as_view(), name="retrieve_update_destroy_fee_item"),
    path("/transaction", ListCreateTransaction.as_view(), name="list_create_transaction"),
    path("/transaction/<uuid:pk>", RetrieveUpdateDestroyTransaction.as_view(), name="retrieve_update_destroy_transaction"),
    path("/fee_template", ListCreateFeeTemplate.as_view(), name="list_create_fee_template"),
    path("/fee_template/<uuid:pk>", RetrieveUpdateDestroyFeeTemplate.as_view(), name="retrieve_update_destroy_fee_template"),
    path("/invoice/bulk_create_invoice/<uuid:class_id>", BulkCreateInvoice.as_view(), name="bulk_create_invoice"),
    path("/invoice", ListCreateInvoice.as_view(), name="list_create_invoice"),
    path("/invoice/<uuid:pk>", RetrieveUpdateDestroyInvoice.as_view(), name="retrieve_update_destroy_invoice"),
    path("/process_invoice", ProcessInvoice.as_view(), name="process_invoice"),
    path("/invoice_template/<uuid:invoice_id>", RetrieveInvoiceAPIView.as_view(), name="list_invoice"),
]