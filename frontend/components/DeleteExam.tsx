import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { showAlert } from "@/utility_methods/alert";
import { deleteExam } from "@/apicalls/exam";


const DeleteExam = (props:any) => {
  const [del, TriggerDelete] = useState()

  const queryClient = useQueryClient();
 
 
  async function x  (){
    const gt = await deleteExam(props.sessionID, props.user_session.access_token)

   
    if(gt.status == 204){
      queryClient.invalidateQueries(['subjects'])
      showAlert('success', 'Exam Deleted Successfuly')
    }else{
      showAlert('error', 'An Error Occored')
      
    }
  }


 
 
  return (
     
    <p className=' px-2 pb-3 hover:bg-white text-danger' onClick={()=>{
  
      x()
    }}>Delete</p>
 
  );
};
  
export default DeleteExam;
  