import TeacherDefaultLayout from "@/components/Layouts/TeacherDashbordLayout";


const Grading =()=>{


  return(
    <h1> Grading Page</h1>
  )
}
Grading.getLayout = (page: any) => {
  return <TeacherDefaultLayout>{page}</TeacherDefaultLayout>;
};
export default Grading