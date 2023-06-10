from django.core.management.base import BaseCommand
from utils.factory import SchoolFactory, ClassFactory, TermFactory, SessionFactory, UserFactory, SubjectFactory
from faker import Faker

fk = Faker()

class Command(BaseCommand):
    help = 'Seed the database with 5 entries'

    def handle(self, *args, **options):
        for i in range(5):
            username = fk.unique.user_name()
            owner = UserFactory.create(username=username)
            school = SchoolFactory.create(owner=owner)

            print("User created", owner.id)
            print("School created", school.id)

            for j in range(3):
                class_instance = ClassFactory.create(school=school)
                print("Class created: ", class_instance.id)
                for k in range(2):
                    session_instance = SessionFactory.create(school=school)
        
                    print("Session created: ", session_instance.id)

                    term_instance = TermFactory.create(school=school, session=session_instance)
        
                    print("Term created: ", term_instance.id)

                    subject = SubjectFactory.create(class_id=class_instance, term=term_instance)
                    print("Subject created: ", subject.id)
