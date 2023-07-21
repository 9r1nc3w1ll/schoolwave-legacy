import TeacherDefaultLayout from "@/components/Layouts/TeacherDashbordLayout";


const Attendance =()=>{


  return(
    <h1> Attendance Page</h1>
  )
}
Attendance.getLayout = (page: any) => {
  return <TeacherDefaultLayout>{page}</TeacherDefaultLayout>;
};
export default Attendance