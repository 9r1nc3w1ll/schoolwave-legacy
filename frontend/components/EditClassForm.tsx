import { PropsWithChildren, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { showAlert } from '@/utility_methods/alert';
import { editClass } from '@/apicalls/clas';





interface FormValues {
    name: string;
    description: string;
    class_index: string;
 
   };

//  {  user_session, sessionData, exit}

const EditClassForm = (props:any) => {

  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
 
  const queryClient = useQueryClient();
  useEffect(()=>{
    reset(props.sessionData)
  },[])

  // const { mutateAsync, isLoading, error } = useMutation(
  //   {
  //     async mutationFn(data: any) {
  //       const gt = await axios.patch('http://127.0.0.1:8000/session/session/'+ props.sessionData.id, data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": 'Bearer '+ user_session.access_token, 
            
              
  //         },
  //       })
  //       return gt
  //     },
  //     async onSuccess(data) {
  //       showAlert('success', 'Session Updated Successfuly')
  //       props.exit(false)
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
    (data) => editClass(props.sessionData.id, props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Class Edited Successfuly')
        props.exit(false)
        queryClient.invalidateQueries(['classes'])
  
      },
      onError: (error) => {
        showAlert('error', 'An Error Occured' )
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
          <label htmlFor="name">Name</label>
          <input id="name" type="text"  className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name"> Description</label>
          <input id="Description" type="text"  className="form-input" {...register("description", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name">Class Index</label>
          <input id="class_index" type="number"  className="form-input" {...register("class_index", { required: "This field is required" })} />
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

export default EditClassForm;
