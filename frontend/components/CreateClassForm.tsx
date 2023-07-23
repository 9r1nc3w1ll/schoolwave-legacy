import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { createClass } from '@/apicalls/class-api';





interface FormValues {
    name: string;
    description: string;
    class_index: string;
    code: string;
 
   };



const CreateClassForm = (props: any) => {

  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });

  const queryClient = useQueryClient();


  const { mutate, isLoading, error } = useMutation(
    (data:any) =>{
      return createClass(data, props.user_session.access_token)},
    {
      onSuccess: async (data) => {
        if(!data.error) {showAlert('success', 'Class Created Successfuly')
          props.exit(false)
          reset()
          props.refreshClasses()}else{
          showAlert('error', data.message)
        }

      },
      onError: (error) => {

        showAlert('error', 'An Error Occured')
      }
    }
  );

  const onSubmit = async (data: any, e: any) => {

    data.school = props.user_session.school.id

    mutate(data);
  };
  return (
    <div className="">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name">Class Index</label>
          <input id="class_index" type="number" min='0' className="form-input" {...register("class_index", { required: "This field is required", validate: { positiveNumber: (value) => parseFloat(value) > 0,
            lessThanHundred: (value) => parseFloat(value) < 100 },
          })}  />
        </div>
        <div>
          <label htmlFor="name">Class Short Code</label>
          <input id="code" type="text" placeholder="e.g Pry1A"  className="form-input" {...register("code", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name"> Description</label>
          <input id="Description" type="text"  className="form-input" {...register("description", { required: "This field is required" })} />
        </div>
        <div className="flex justify-center items-center mt-8 mx-auto">

          <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassForm;
