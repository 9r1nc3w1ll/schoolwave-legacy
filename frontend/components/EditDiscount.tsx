import { useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { editSession } from '@/apicalls/session';
import { editDiscount } from '@/apicalls/fees';





interface FormValues {
    start_date: string;
    end_date: string;
    resumption_date: string;
   };



const EditDiscount = (props:any) => {

  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
 
  const queryClient = useQueryClient();
  useEffect(()=>{
    reset(props.sessionData)
  },[])

  const { mutate, isLoading, error } = useMutation(
    (data) => editDiscount(props.sessionData.id, props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Session Edited Successfuly')
        props.refreshSession()
        props.exit(false)
        
  
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




  const onSubmit = async (data: any) => { 

    mutate(data); };
  return (
    <div  className="">
      <form className="space-y-5"   onSubmit={handleSubmit(onSubmit)}>
      
        <div>
          <label htmlFor="name">Name</label>
          <input id="discount_type" type="text"  className="form-input" {...register("discount_type", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name">Amount</label>
          <input id="amount" type="number"  className="form-input" {...register("amount", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name">Percentage</label>
          <input id="percentage" type="number"  className="form-input" {...register("percentage", { required: "This field is required" })} />
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

export default EditDiscount;