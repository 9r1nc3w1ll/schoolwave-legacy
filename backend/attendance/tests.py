from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from .models import StudentAttendance

class StudentAttendanceCRUDTestCase(APITestCase):
    def setUp(self):
        self.attendance = StudentAttendance.objects.create(
            date="2023-05-30",
            student_id=1,
            class_id=1,
            subject="Math",
            start_time="09:00:00",
            end_time="10:00:00",
            attendance_type="Daily",
            present=True,
            remark="Good",
            staff_id=1
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_create_student_attendance(self):
        data = {
            "date": "2023-05-31",
            "student_id": 2,
            "class_id": 2,
            "subject": "English",
            "start_time": "10:00:00",
            "end_time": "11:00:00",
            "attendance_type": "Class",
            "present": True,
            "remark": "Excellent",
            "staff_id": 2
        }

        response = self.client.post(reverse("student-attendance-list-create"), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_student_attendance(self):
        response = self.client.get(reverse("student-attendance-retrieve-update-destroy", args=[self.attendance.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.attendance.id)

    def test_update_student_attendance(self):
        data = {
            "date": "2023-06-01",
            "student_id": 3,
            "class_id": 3,
            "subject": "Science",
            "start_time": "11:00:00",
            "end_time": "12:00:00",
            "attendance_type": "Daily",
            "present": False,
            "remark": "Needs improvement",
            "staff_id": 3
        }

        response = self.client.put(reverse("student-attendance-retrieve-update-destroy", args=[self.attendance.id]), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["date"], data["date"])

    def test_delete_student_attendance(self):
        response = self.client.delete(reverse("student-attendance-retrieve-update-destroy", args=[self.attendance.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_list_student_attendance(self):
        response = self.client.get(reverse("student-attendance-list-create"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)
