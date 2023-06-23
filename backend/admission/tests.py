from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from account.models import User
from school.models import School
from admission.models import AdmissionRequest, StudentInformation

import io
from datetime import datetime
from django.core.files.uploadedfile import SimpleUploadedFile

class BatchUploadAdmissionRequestTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.school = School.objects.create(name="Test School", owner=self.user)
        # self.url = reverse("batch_upload_requests")

        # self.client.force_authenticate(user=self.user)
    
    def test_batch_upload_admission_request(self):
        url = reverse("batch_upload_requests")
        self.client.force_authenticate(user=self.user)
        csv_data = """
        username,password,first_name,last_name,email,date_of_birth,gender,blood_group,religion,phone_number,city,state,address,guardian_name,relation,guardian_occupation,guardian_phone_number,guardian_address
        student1,testpass,John,Doe,john@example.com,1990-01-01,male,O+,Christian,1234567890,New York,NY,123 ABC Street,Guardian1,Father,Engineer,9876543210,456 XYZ Street
        student2,testpass,Jane,Doe,jane@example.com,1992-01-01,female,A-,Christian,0987654321,Los Angeles,CA,789 DEF Street,Guardian2,Mother,Doctor,1234567890,789 UVW Street
        """

        csv_file = io.StringIO(csv_data)
        csv_file.name = "admission_requests.csv"

        csv = SimpleUploadedFile("admission_requests.csv", csv_file.read().encode())
        print("data", csv)
        response = self.client.post(
            url,
            data={"school_id": self.school.id},
              
            files={"csv": csv},
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

        self.client.force_authenticate(user=self.user)        

    
    def test_list_admission_requests(self):
        student_info = StudentInformation.objects.create(
            username="student1", password="testpass", first_name="John", last_name="Doe",
            date_of_birth=datetime.now()
        )
        student_info_2 = StudentInformation.objects.create(
            username="student2", password="testpass", first_name="John", last_name="Doe",
            date_of_birth=datetime.now()
        )
        AdmissionRequest.objects.create(status="approved", student_info=student_info, school=self.school)
        AdmissionRequest.objects.create(status="denied", student_info=student_info_2, school=self.school)

        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 2)

    def test_create_admission_request(self):
        student_info = StudentInformation.objects.create(
            username="student1", password="testpass", first_name="John", last_name="Doe",
            date_of_birth=datetime.now()
        )

        data = {
            "status": "pending",
            "student_info": student_info.id,
            "school": self.school.id
        }

        response = self.client.post(self.url, data=data, format="json")


        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AdmissionRequest.objects.count(), 1)

class RUDAdmissionRequestsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.school = School.objects.create(name="Test School", owner=self.user)

        student_info = StudentInformation.objects.create(
            username="student1", password="testpass", first_name="John", last_name="Doe",
            date_of_birth=datetime.now()
        )

        self.client.force_authenticate(user=self.user)
        self.admission_request = AdmissionRequest.objects.create(status="pending", student_info=student_info, school=self.school)
        self.url = reverse("retrieve_update_destroy_requests", kwargs={"pk": self.admission_request.id})
    
    def test_retrieve_admission_request(self):
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["id"], str(self.admission_request.id))

    def test_update_admission_request(self):
        data = {
            "status": "approved",
            "comment_if_declined": ""
        }

        response = self.client.patch(self.url, data=data, format="json")
        updated_admission_request = AdmissionRequest.objects.get(id=self.admission_request.id)

        print("update", response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(updated_admission_request.status, "approved")

    def test_delete_admission_request(self):
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(AdmissionRequest.objects.count(), 0)
