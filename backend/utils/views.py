from django.db.models import F
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from utils.flutterwave import verify_flutterwave_tx, generate_random_number
from utils.storages import S3Manager

import hashlib
import hmac
from django.conf import settings
import geocoder


class PaystackWebhook(APIView):
    def post(self, request, *args, **kwargs):
        secret = getattr(settings, "PAYSTACK_SECRET_KEY")

        data = request.body
        hash = hmac.new(key=secret.encode('utf-8'), msg=data, digestmod=hashlib.sha512).hexdigest()
        
        if hash != request.headers["x-paystack-signature"]:
            return Response({"error" : "Paystack Validation Failed"}, status=status.HTTP_400_BAD_REQUEST)

        webhook_data = request.data
            
        
        if webhook_data["event"] == "charge.success":
            # Handle payment here when fleshed out.
            pass


class FetchRef(APIView):

    def get(self, request, *args, **kwargs):
        ref = generate_random_number()
        return Response({"ref" : ref})


class VerifyFlutterwaveTx(APIView):

    def get(self, request, *args, **kwargs):
        ref = request.GET.get("ref", "")

        status, data = verify_flutterwave_tx(ref)
        return Response({"status" : status, "data" : data})


def get_user_location():
    try:
        user_location = geocoder.ip('me')

        if user_location.ok:
            latitude = user_location.latlng[0]
            longitude = user_location.latlng[1]

            return latitude, longitude
        else:
            print("Failed to retrieve user location.")
            return None
    except Exception as e:
        print("An error occurred:", str(e))
        return None




class GeneratePresignedURLView(APIView):
    def get(self, request):
        object_name = request.GET.get('object_name')
        object_type = request.GET.get('object_type')

        s3_manager = S3Manager()
        presigned_url = s3_manager.generate_presigned_url(settings.AWS_STORAGE_BUCKET_NAME, object_name, object_type)

        return Response(presigned_url)