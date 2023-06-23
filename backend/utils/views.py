from .webhook import BaseWebhook
from django.db.models import F
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class PaystackWebhook(APIView):
    def post(self, request, *args, **kwargs):
        webhook_data, webhook_status = BaseWebhook(request).webhook_handler()

        if not webhook_status:
            return Response({"error" : "Paystack Validation Failed"}, status=status.HTTP_400_BAD_REQUEST)
        
        if webhook_data["event"] == "charge.success":
            # Handle payment here when fleshed out.
            pass