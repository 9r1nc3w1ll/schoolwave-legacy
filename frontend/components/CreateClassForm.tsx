import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { createClass } from '@/apicalls/clas';





interface FormValues {
    name: string;
    description: string;
    class_index: string;
 
   };



const CreateClassForm = (props:any) => {

  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
 
  const queryClient = useQueryClient();


  const { mutate, isLoading, error } = useMutation(
    (data) =>
      createClass(props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Class Created Successfuly')
        props.exit(false)
        reset()
        queryClient.invalidateQueries(['classes'])
  
      },
      onError: (error) => {
      
        showAlert('error', 'An Error Occured' )
      }
    }
  );

  const onSubmit = async (data: any) => { 

    data.school = props.user_session.school.id
   
    mutate(data); 
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
