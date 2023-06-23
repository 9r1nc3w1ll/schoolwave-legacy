import hashlib
import hmac
from django.conf import settings


class BaseWebhook(object):
    def __init__(self, request):
        self.request = request

    def webhook_handler(self):
        secret = getattr(settings, "PAYSTACK_SECRET_KEY")

        data = self.request.body
        hash = hmac.new(key=secret.encode('utf-8'), msg=data, digestmod=hashlib.sha512).hexdigest()
        
        if hash != self.request.headers["x-paystack-signature"]:
            return "Validation Failed", False

        return self.request.data, True