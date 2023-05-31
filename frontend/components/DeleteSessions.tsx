import { useEffect, useState } from "react";
import axios from "axios";
import { useQueryClient } from "react-query";
import { showAlert } from "@/utility_methods/alert";
import { deleteSession } from "@/apicalls/session";

const DeleteSessions = ({sessionID, user_session}) => {
  const [del, TriggerDelete] = useState()

  const queryClient = useQueryClient();
 
 
  async function x  (){
    const gt = await deleteSession(sessionID, user_session.access_token)
   
    if(gt.status == 204){
      queryClient.invalidateQueries(['sessions'])
      showAlert('success', 'Session Deleted Successfuly')
    }else{
      showAlert('error', 'An Error Occored')
      
    }
  }


 
 
  return (
     
    <p className=' px-2 pb-3 hover:bg-white text-danger' onClick={()=>{
      // console.log('clicked')
      x()
    }}>Delete</p>
 
  );
};
  
export default DeleteSessions;
  