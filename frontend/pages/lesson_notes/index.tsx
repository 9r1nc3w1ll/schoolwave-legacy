import TeacherDefaultLayout from "@/components/Layouts/TeacherDashbordLayout";


const LessonNotes =()=>{


  return(
    <h1> Lesson Notes Page</h1>
  )
}
LessonNotes.getLayout = (page: any) => {
  return <TeacherDefaultLayout>{page}</TeacherDefaultLayout>;
};
export default LessonNotes