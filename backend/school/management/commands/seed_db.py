from django.core.management.base import BaseCommand
from utils.factory import (
    SchoolFactory, ClassFactory,
    TermFactory, SessionFactory,
    UserFactory, SubjectFactory,
    DiscountFactory, FeeItemFactory,
    FeeTemplateFactory, InvoiceFactory,
    TransactionFactory, ClassMemberFactory,
    SubjectStaffAssignmentFactory, StaffRoleFactory,
    StaffFactory
    )
from faker import Faker

fk = Faker()

class Command(BaseCommand):
    help = 'Seed the database with 5 entries'

    def handle(self, *args, **options):
        for i in range(5):
            username = fk.unique.user_name()
            owner = UserFactory.create(username=username)
            school = SchoolFactory.create(owner=owner)
            role = StaffRoleFactory.create()
            staff = StaffFactory.create(user=owner)
                    

            print("User created", owner.id)
            print("School created", school.id)
            print("Staff Role created: ", role.id)
            print("Staff created: ", staff.id)

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

                    discount = DiscountFactory.create(school=school)
                    print("Discount created: ", discount.id)

                    fee_item = FeeItemFactory.create(discount=discount, school=school)
                    print("Fee Item created: ", fee_item.id)

                    template = FeeTemplateFactory.create(discount=discount, school=school, class_id=class_instance)
                    print("Fee Template created: ", template.id)

                    invoice = InvoiceFactory.create(template=template, school=school, student=owner)
                    print("Invoice created: ", invoice.id)

                    transaction = TransactionFactory.create(school=school)
                    print("Transaction created: ", transaction.id)

                    class_member = ClassMemberFactory.create(user=owner, class_id=class_instance)
                    print("Class member created: ", class_member.id)

                    subject_staff_assignment = SubjectStaffAssignmentFactory.create(staff=staff, role=role, subject=subject)
                    print("Subject Staff Assignment created: ", subject_staff_assignment.id)