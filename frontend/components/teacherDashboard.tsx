import TeacherDefaultLayout from "@/components/Layouts/TeacherDashbordLayout";


const Dashboard =()=>{


  return(
    <h1> Welcome to schoolwave Teacher Dashboard</h1>
  )
}
Dashboard.getLayout = (page: any) => {
  return <TeacherDefaultLayout>{page}</TeacherDefaultLayout>;
};
export default Dashboard