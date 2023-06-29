import { useMutation, useQueryClient } from "react-query";
import { showAlert } from "@/utility_methods/alert";
import { deleteSession, editSession } from "@/apicalls/session";

const ActivateSessions = (props:any) => {
  const queryClient = useQueryClient();
 
 
  const { mutate, isLoading, error } = useMutation(
    () => editSession(props.sessionData.id, props.user_session.access_token, {"active": true}),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Session Activated Successfuly')
        props.refreshSession()
  
      },
      onError: (error:any) => {
        let x =error.response.data.message.split(' ')
        
  
        if(x.indexOf('duplicate') >=0 && x.indexOf('key') >=0  && x.indexOf('constraint') >=0){

          showAlert('error', 'A session with same Start Date or End Date already exist')
        }else{
          showAlert('error', 'An Error Occured' )
        }
      }
    }
  );

  return (
     
    <p className=' px-2 pb-3 hover:bg-white' onClick={()=>{
      mutate()
    }}>Set as Current</p>
 
  );
};
  
export default ActivateSessions;
  