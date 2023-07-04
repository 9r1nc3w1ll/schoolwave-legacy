import { PropsWithChildren, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { editSubject } from '@/apicalls/subjects';





interface FormValues {
    name: string;
    description: string;
    class_id: string;
    code: string;
    term_id: string


 
   };



const EditSubjectForm = (props:any) => {

  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
 
  const queryClient = useQueryClient();
  useEffect(()=>{
    reset(props.sessionData)
  },[])
  const { mutate, isLoading, error } = useMutation(
    (data) => editSubject(props.sessionData.id, props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Subject Edited Successfuly')
        props.exit(false)
        props.refreshClasses()
  
      },
      onError: (error) => {
        showAlert('error', 'An Error Occured' )
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
          <input id="name" type="text"  className="form-input" {...register("name", { required: "This field is required" })} />
        </div>

        <div>
          <label htmlFor="name">Code</label>
          <input id="code" type="number"  className="form-input" {...register("code", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name"> Descirption</label>
          <input id="description" type="text"  className="form-input" {...register("description", { required: "This field is required" })} />
        </div>

        <div>
          <label htmlFor="name"> Class</label>
          <input id="Description" type="text"  className="form-input" {...register("class_id", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name"> Term</label>
          <input id="term" type="text"  className="form-input" {...register("term", { required: "This field is required" })} />
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

export default EditSubjectForm;
