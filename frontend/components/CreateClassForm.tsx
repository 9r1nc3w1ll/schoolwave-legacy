import { PropsWithChildren, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { showAlert } from '@/utility_methods/alert';
import { createClass } from '@/apicalls/class';





interface FormValues {
    name: string;
    description: string;
    class_index: string;
 
   };



const CreateClassForm = ({ children, create, user_session, sessionID, exit, updateData}: PropsWithChildren) => {

  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
 
  const queryClient = useQueryClient();

// console.log(user_session.access_token)

  const { mutate, isLoading, error } = useMutation(
    (data) =>
      createClass(user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Class Created Successfuly')
        exit(false)
        reset()
        queryClient.invalidateQueries(['classes'])
  
      },
      onError: (error) => {
      
        showAlert('error', 'An Error Occured' )
      }
    }
  );

  const onSubmit = async (x: any) => { 

    x.school = '04a2ded0-0551-45c2-b29e-bd8641d70455'
    // console.log('aaaaaaaa', x)
    mutate(x); 
  };
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

export default CreateClassForm;
