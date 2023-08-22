import random
from django.conf import settings
import requests
import string

def generate_random_number():
    rand = ''.join(
        [random.choice(string.digits) for n in range(7)])
    rand = 'Tx-' + rand
    return rand


def verify_flutterwave_tx(tx_ref):
    resp = requests.get(f"https://api.flutterwave.com/v3/transactions/{tx_ref}/verify", headers={
        "Authorization" : f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"
    }).json()
    

    return resp["status"], resp["data"]