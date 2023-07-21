import TeacherDefaultLayout from "@/components/Layouts/TeacherDashbordLayout";


const AccountSettings =()=>{


  return(
    <h1>  Account Settings Page</h1>
  )
}
AccountSettings.getLayout = (page: any) => {
  return <TeacherDefaultLayout>{page}</TeacherDefaultLayout>;
};
export default AccountSettings