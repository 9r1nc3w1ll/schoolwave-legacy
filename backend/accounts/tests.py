from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()
    
class AuthenticationTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="username", password="password")
    
    def test_user_login(self):
        data = {"username": "username", "password": "password"}

        response = self.client.post(reverse("user_login"), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    
    def test_user_login_with_incorrect_credentials(self):
        data = {"username": "username", "password": "wrongpassword"}

        response = self.client.post(reverse("user_login"), data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_fetch_user_with_jwt(self):
        headers = {
            'Authorization' : f'Bearer {self.user.tokens["access"]}'
        }
        response = self.client.get(reverse("fetch_user"), headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

