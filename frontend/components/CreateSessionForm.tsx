import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { createSession } from '@/apicalls/session';
import {useEffect} from 'react'





interface FormValues {
    start_date: string;
    end_date: string;
    resumption_date: string;
    active: boolean
   };



const CreateSessionForm = ( props:any) => {


  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });

  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation(
    (data) =>
      createSession(props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Session Created Successfuly')
        props.refreshList()
        props.exit(false)
        reset()
        
  
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

  const onSubmit = async (tempData: any) => { 
    tempData.active = false
    tempData.school = props.user_session?.school.id
    mutate(tempData);                                                                  
  };
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

          <button  type="submit"  className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSessionForm;