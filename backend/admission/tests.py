from datetime import datetime

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from account.models import User
from admission.models import AdmissionRequest, StudentInformation
from school.models import School


class BatchUploadAdmissionRequestTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.school = School.objects.create(name="Test School", owner=self.user)

    def test_batch_upload_admission_request(self):
        url = reverse("batch_upload_requests")
        self.client.force_authenticate(user=self.user)
        with open("admission/sample_admission_requests.csv") as csv:
            response = self.client.post(
                path=url,
                data={"school_id": self.school.id, "csv": csv},
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(AdmissionRequest.objects.count(), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(AdmissionRequest.objects.count(), 2)


class ListCreateAdmissionRequestsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.school = School.objects.create(name="Test School", owner=self.user)
        self.url = reverse("list_create_requests")

        self.student_info = StudentInformation.objects.create(
            username="student1",
            password="testpass",
            first_name="John",
            last_name="Doe",
            date_of_birth=datetime.now(),
        )

        self.student_info = StudentInformation.objects.create(
            username="student2",
            password="testpass",
            first_name="John",
            last_name="Doe",
            date_of_birth=datetime.now(),
        )

        self.student_info_2 = StudentInformation.objects.create(
            username="student3",
            password="testpass",
            first_name="John",
            last_name="Doe",
            date_of_birth=datetime.now(),
        )

        # Create an admission request
        self.addmission_request_1 = AdmissionRequest.objects.create(
            status="pending", student_info=self.student_info, school=self.school
        )

        self.addmission_request_2 = AdmissionRequest.objects.create(
            status="denied", student_info=self.student_info_2, school=self.school
        )

        self.client.force_authenticate(user=self.user)

    def test_list_admission_requests(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 2)

    def test_create_single_admission_request(self):
        url = reverse("create_single_admission")
        self.client.force_authenticate(user=self.user)

        data = {
            "username": "new_random_username",
            "password": "testnewpassword",
            "first_name": "Test",
            "last_name": "TestLast",
            "date_of_birth": "1998-01-20",
            "gender": "male",
            "school": self.school.id
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_batch_update_admission_request(self):
        url = reverse("batch_update_requests")
        self.client.force_authenticate(user=self.user)

        data = {
            "ids": [self.addmission_request_1.id, self.addmission_request_2.id],
            "data": {
                "status": "approved",
                "comment_if_declined": "Updated comment"
            }
        }

        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(AdmissionRequest.objects.get(id=self.addmission_request_1.id).status, "approved")
        self.assertEqual(AdmissionRequest.objects.get(id=self.addmission_request_2.id).status, "approved")



class RUDAdmissionRequestsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.school = School.objects.create(name="Test School", owner=self.user)

        student_info = StudentInformation.objects.create(
            username="student1",
            password="testpass",
            first_name="John",
            last_name="Doe",
            date_of_birth=datetime.now(),
        )

        self.client.force_authenticate(user=self.user)
        self.admission_request = AdmissionRequest.objects.create(
            status="pending", student_info=student_info, school=self.school
        )
        self.url = reverse(
            "retrieve_update_destroy_requests", kwargs={"pk": self.admission_request.id}
        )

    def test_retrieve_admission_request(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["id"], str(self.admission_request.id))

    def test_update_admission_request(self):
        data = {"status": "approved", "comment_if_declined": ""}

        response = self.client.patch(self.url, data=data, format="json")
        updated_admission_request = AdmissionRequest.objects.get(
            id=self.admission_request.id
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(updated_admission_request.status, "approved")

    def test_delete_admission_request(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(AdmissionRequest.objects.count(), 0)