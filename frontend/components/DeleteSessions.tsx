import { useQueryClient } from "react-query";
import { showAlert } from "@/utility_methods/alert";
import { deleteSession } from "@/apicalls/session";

const DeleteSessions = (props:any) => {
  const queryClient = useQueryClient();
 
 
  async function x  (){
    const gt = await deleteSession(props.sessionID, props.user_session.access_token)
   
    if(gt.status == 204){
      props.refreshSession()
      showAlert('success', 'Session Deleted Successfuly')
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
  
export default DeleteSessions;
  