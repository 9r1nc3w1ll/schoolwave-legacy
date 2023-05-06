from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.exceptions import ValidationError

from school.serializers import SchoolSerializer

from django.contrib.auth import get_user_model
User = get_user_model()

class AppStatusViewTest(APITestCase):
    def test_app_status_no_user_no_school(self):
        url = reverse('app_status')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_app_status_with_user(self):
        url = reverse('user_onboarding')
        data = {
                "username": "name1",
                "password": "password1123@!",
                "email": "sample@example.com",
                "first_name": "Name",
                "last_name": "Lastname"
            }
        response = self.client.get(url, data)
        print(f"test_app_status_with_user{response.status_code}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)



class UserAPIViewTest(APITestCase):
    def test_create_user_valid_credentials(self):
        url = reverse('user_onboarding')
        data = {
                "username": "name1",
                "password": "password1123@!",
                "email": "sample@example.com",
                "first_name": "Name",
                "last_name": "Lastname",
                "role": "student"
            }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_create_user_invalid_credentials(self):
        url = reverse('user_onboarding')
        data = {
            "username": "",
            "password": "",
            "email": "",
            "first_name": "",
            "last_name": ""
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class SchoolAPIViewTest(APITestCase):
    def test_create_school_valid_data(self):
        user_id = self.test_create_user_valid_credentials()
        url = reverse('school_onboarding')
        data = {
            "name": "Example School",
            "description": "This is an example school.",
            "owner": user_id,
            "date_of_establishment": "2022-01-01",
            "motto": "Learning is fun!",
            "website_url": "https://www.example.com",
            "tag": "example-school"
        }

        headers = {
            'Authorization' : f'Bearer {self.user.tokens["access"]}'
        }
        response = self.client.post(url, data)
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Content: {response.content.decode()}")

        serializer = SchoolSerializer(data=data)
        serializer.is_valid()
        print(f"Serializer Errors: {serializer.errors}")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)



    def test_create_school_invalid_data(self):
        url = reverse('school_onboarding')
        data = {
                "name": "",
                "description": "",
                "owner": "",
                "date_of_establishment": "",
                "motto": "",
                "website_url": "",
                "tag": ""
            }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
