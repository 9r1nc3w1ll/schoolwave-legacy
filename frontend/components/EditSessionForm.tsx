import { PropsWithChildren, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { showAlert } from '@/utility_methods/alert';
import { editSession } from '@/apicalls/session';





interface FormValues {
    start_date: string;
    end_date: string;
    resumption_date: string;
   };



const EditSessionForm = ({ children, create, user_session, sessionData, exit}: PropsWithChildren) => {

  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
 
  const queryClient = useQueryClient();
  useEffect(()=>{
    reset(sessionData)
  },[])

  // const { mutateAsync, isLoading, error } = useMutation(
  //   {
  //     async mutationFn(data: any) {
  //       const gt = await axios.patch('http://127.0.0.1:8000/session/session/'+ sessionData.id, data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": 'Bearer '+ user_session.access_token, 
            
              
  //         },
  //       })
  //       return gt
  //     },
  //     async onSuccess(data) {
  //       showAlert('success', 'Session Updated Successfuly')
  //       exit(false)
  //       queryClient.invalidateQueries(['sessions'])
  //     },
  //    onError: (error) => {
  //     let x =error.response.data.message.split(' ')
        
  //     // console.log('qwqwqqwww',x)
  //     if(x.indexOf('duplicate') >=0 && x.indexOf('key') >=0  && x.indexOf('constraint') >=0){

  //       showAlert('error', 'A session with same Start Date or End Date already exist')
  //     }else{
  //       showAlert('error', 'An Error Occured' )
  //     }
  //     }
  //   }
  // );


  const { mutate, isLoading, error } = useMutation(
    (data) => editSession(sessionData.id, user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Session Edited Successfuly')
        exit(false)
        queryClient.invalidateQueries(['session'])
  
      },
      onError: (error) => {
        let x =error.response.data.message.split(' ')
        
        // console.log('qwqwqqwww',x)
        if(x.indexOf('duplicate') >=0 && x.indexOf('key') >=0  && x.indexOf('constraint') >=0){

          showAlert('error', 'A session with same Start Date or End Date already exist')
        }else{
          showAlert('error', 'An Error Occured' )
        }
      }
    }
  );




  const onSubmit = async (data: any) => { 
    // console.log('rrr', data)
    mutate(data); };
  return (
    <div  className="">
      <form className="space-y-5"   onSubmit={handleSubmit(onSubmit)}>
      
        <div>
          <label htmlFor="name">Start Date</label>
          <input id="start_date" type="date"  className="form-input" {...register("start_date", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name">End Date</label>
          <input id="end_date" type="date"  className="form-input" {...register("end_date", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name">Resumption Date</label>
          <input id="resumption_date" type="date"  className="form-input" {...register("resumption_date", { required: "This field is required" })} />
        </div>
        <div className="flex justify-center items-center mt-8 mx-auto">

          <button  type="button" className="btn btn-outline-danger" onClick={()=>{exit(false)}}>
                                            Discard
          </button>
          <button  type="submit"  className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSessionForm;
