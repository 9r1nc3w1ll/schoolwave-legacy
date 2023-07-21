import TeacherDefaultLayout from "@/components/Layouts/TeacherDashbordLayout";


const Examination =()=>{


  return(
    <h1> Examination/Quiz Page</h1>
  )
}
Examination.getLayout = (page: any) => {
  return <TeacherDefaultLayout>{page}</TeacherDefaultLayout>;
};
export default Examination