# from django.contrib.auth import get_user_model
# from django.urls import reverse
# from rest_framework.test import APITestCase
# from rest_framework import status

# User = get_user_model()


# class AuthenticationTestCase(APITestCase):
#     def setUp(self):
#         self.user = User.objects.create(username="username", password="password")

#     def test_user_login(self):
#         data = {"username": "username", "password": "password"}

#         response = self.client.post(reverse("user_login"), data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_user_login_with_incorrect_credentials(self):
#         data = {"username": "username", "password": "wrongpassword"}

#         response = self.client.post(reverse("user_login"), data)
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

#     def test_fetch_user_with_jwt(self):
#         headers = {"Authorization": f'Bearer {self.user.tokens["access"]}'}
#         response = self.client.get(reverse("fetch_user"), headers=headers)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_password_change_with_correct_password(self):
#         data = {"old_password": "password", "new_password": "newpassword"}

#         headers = {"Authorization": f'Bearer {self.user.tokens["access"]}'}

#         response = self.client.post(
#             reverse("password_change"), data=data, headers=headers
#         )
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_password_change_with_incorrect_password(self):
#         data = {"old_password": "22password", "new_password": "newpassword"}

#         headers = {"Authorization": f'Bearer {self.user.tokens["access"]}'}

#         response = self.client.post(
#             reverse("password_change"), data=data, headers=headers
#         )
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# class UserCRUDTestCase(APITestCase):
#     def setUp(self):
#         self.user = User.objects.create(username="username", password="password")
#         self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

#     def test_create_user(self):
#         data = {"username": "newuser", "password": "newpassword"}

#         response = self.client.post(reverse("users"), data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_retrieve_user(self):
#         response = self.client.get(reverse("user-detail", args=[self.user.id]))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data["id"], self.user.id)

#     def test_update_user(self):
#         data = {"username": "updateduser"}

#         response = self.client.put(reverse("user-detail", args=[self.user.id]), data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data["username"], data["username"])

#     def test_delete_user(self):
#         response = self.client.delete(reverse("user-detail", args=[self.user.id]))
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

#     def test_list_users(self):
#         response = self.client.get(reverse("users"))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertGreater(len(response.data), 0)