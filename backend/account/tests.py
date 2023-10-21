from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core import mail
from django.core.files import File
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from .tokens import password_reset_token

from school.models import School

User = get_user_model()


class AuthenticationTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username="username")
        self.user.set_password("password")
        self.user.save()

    def test_user_login(self):
        data = {"username": "username", "password": "password"}

        response = self.client.post(reverse("user_login"), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_login_with_incorrect_credentials(self):
        data = {"username": "username", "password": "wrongpassword"}

        response = self.client.post(reverse("user_login"), data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_fetch_user_with_jwt(self):
        headers = {"Authorization": f'Bearer {self.user.tokens["access"]}'}
        response = self.client.get(reverse("fetch_user"), headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_change_with_correct_password(self):
        data = {"old_password": "password", "new_password": "newpassword"}

        headers = {"Authorization": f'Bearer {self.user.tokens["access"]}'}

        response = self.client.post(
            reverse("password_change"), data=data, headers=headers
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_change_with_incorrect_password(self):
        data = {"old_password": "22password", "new_password": "newpassword"}

        headers = {"Authorization": f'Bearer {self.user.tokens["access"]}'}

        response = self.client.post(
            reverse("password_change"), data=data, headers=headers
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserCRUDTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username="username", password="password")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

        self.school = School.objects.create(
            name="Test School",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

    def test_create_user(self):
        url = reverse("users")
        self.client.force_authenticate(user=self.user)

        data = {"username": "newuser", 
                "password": "newpassword", 
                "first_name":"user_firstname", 
                "last_name":"User_last_name",
                "school":self.school.id}

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_user(self):
        response = self.client.get(reverse("user-detail", args=[self.user.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["username"], self.user.username)        

    def test_update_user(self):
        url = reverse("user-detail", kwargs={"user_id": self.user.id})
        self.client.force_authenticate(user=self.user)

        data = {"username": "updateduser"}

        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["username"], data["username"])

    def test_delete_user(self):
        url = reverse("user-detail", kwargs={"user_id": self.user.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "User deleted successfully.")

    def test_list_users(self):
        url = reverse("users")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_retrieve_user_profile(self):
        url = reverse("user-profile")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["username"], self.user.username)        

    def test_update_user_profile(self):
        url = reverse("user-profile") 
        self.client.force_authenticate(user=self.user)

        data = {
            "profile_photo": '',
            "first_name":"user_firstname",
            "last_name":"User_last_name"
        }

        response = self.client.patch(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["first_name"], data["first_name"])
        self.assertEqual(response.data["data"]["last_name"], data["last_name"])

class CreateSuperAdminTestCase(APITestCase):

    def test_create_user(self):
        url = reverse("create_super_admin")

        data = {"username": "super_admin", 
                "password": "newpassword", 
                "first_name":"user_firstname", 
                "last_name":"User_last_name"}

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)



class RequestPasswordResetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="password123")

    def test_request_password_reset_valid_email(self):
        data = {"email": "test@example.com"}
        response = self.client.post(reverse("request_password_reset"), data, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Password reset email has been sent to the user.", response.data["message"])

    def test_request_password_reset_invalid_email(self):
        data = {"email": "nonexistent@example.com"}

        response = self.client.post(reverse("request_password_reset"), data, format="json")
        
        self.assertEqual(response.status_code, 400)

class VerifyTokenTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="password123")

    def test_verify_token_valid_token(self):
        token = password_reset_token.make_token(self.user)
        email = urlsafe_base64_encode(force_bytes(self.user.email))
        response = self.client.get(reverse("verify_token", kwargs={"hashed_email": email, "token": token}))

        
        self.assertEqual(response.status_code, 200)
        self.assertIn("User Validated. Please set your password", response.data["message"])

    def test_verify_token_invalid_token(self):
        token = "invalid_token"
        email = urlsafe_base64_encode(force_bytes(self.user.email))
        response = self.client.get(reverse("verify_token", kwargs={"hashed_email": email, "token": token}))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Invalid token")

class ResetPasswordTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="password123")

    def test_reset_password_valid_token(self):
        token = password_reset_token.make_token(self.user)
        email = urlsafe_base64_encode(force_bytes(self.user.email))
        data = {"hashed_email": email, "token": token, "password": "newpassword123", "confirm_password": "newpassword123"}
        response = self.client.post(reverse("reset_password"), data, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertIn("Password changed successfully.", response.data["message"])

    def test_reset_password_invalid_token(self):
        token = "invalid_token"
        email = urlsafe_base64_encode(force_bytes(self.user.email))
        data = {"hashed_email": email, "token": token, "password": "newpassword123", "confirm_password": "newpassword123"}
        response = self.client.post(reverse("reset_password"), data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Invalid token")
