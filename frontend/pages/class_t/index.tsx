import TeacherDefaultLayout from "@/components/Layouts/TeacherDashbordLayout";


const Class =()=>{


  return(
    <h1> Class Page</h1>
  )
}
Class.getLayout = (page: any) => {
  return <TeacherDefaultLayout>{page}</TeacherDefaultLayout>;
};
export default Class 