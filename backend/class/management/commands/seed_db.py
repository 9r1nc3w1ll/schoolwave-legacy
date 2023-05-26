from django.core.management.base import BaseCommand
from utils.factory import SchoolFactory, ClassFactory, SessionFactory, UserFactory
from faker import Faker

fk = Faker()

class Command(BaseCommand):
    help = 'Seed the database with 50 entries'

    def handle(self, *args, **options):
        for i in range(5):
            owner = UserFactory.create(username=fk.user_name())
            school = SchoolFactory.create(owner=owner)

            print("User created", owner.id)
            print("School created", school.id)

            for j in range(3):
                class_instance = ClassFactory.create(school=school)
                print("Class created: ", class_instance.id)
                for k in range(2):
                    session_instance = SessionFactory.create(school=school)
        
                    print("Session created: ", session_instance.id)
