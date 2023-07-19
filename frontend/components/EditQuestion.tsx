import { PropsWithChildren, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import {  useState } from 'react';
import { getClasses } from '@/apicalls/class-api';
import Select from 'react-select';
import { editExamQuestion } from '@/apicalls/exam';
import { getSubjects } from '@/apicalls/subjects';







const EditQuestionForm = (props:any) => {

  const { register, handleSubmit, reset, setValue } = useForm({ shouldUseNativeValidation: true });
 
  const queryClient = useQueryClient();
  useEffect(()=>{
    reset(props.sessionData)
  },[])
  const { mutate, isLoading, error } = useMutation(
    (data) => editExamQuestion(props.sessionData.id, props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Exam Question Edited Successfuly')
        props.exit(false)
        props.refreshClasses()
  
      },
      onError: (error) => {
        showAlert('error', 'An Error Occured' )
      }
    }
  );

 
  const { data: subjects, isSuccess:isSuccess2, status:status2, refetch:refetch2 } = useQuery('examquestionss', () => getSubjects(props.user_session?.access_token), {enabled: false})

  interface subjectsOption {
    id: string;
    name: string;
  }

  const [subjectsOptions, setsubjectsOptions] = useState<subjectsOption[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);


  useEffect(()=>{
  
    
    
    setsubjectsOptions(subjects)
    refetch2()
  
  } 
  );

  let subjects_options:any = [];


  subjects_options = subjects?.map((option: subjectsOption) => ({

    value: option.id,
    label: option.name,
  }));

  const handleQuestionChange = (selectedOptions: any) => {
    setSelectedQuestions(selectedOptions);
  };



  const onSubmit = async (data: any) => { 
   
    mutate(data); };

  useEffect(() => {
    if (props.sessionData) {
      setValue("title", props.sessionData.name);
      setValue("details", props.sessionData.details); 
      setValue("type", props.sessionData.type);
      setValue("subject", props.sessionData.subject);
      
 


    }
  }, [props.sessionData, setValue]);

  return (
    <div  className="">
      <form className="space-y-5"   onSubmit={handleSubmit(onSubmit)}>
      
      <div>
                        <label htmlFor="title">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your title"
                          {...register("title", { required: "This field is required" })}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="details">
                          Details <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter details of your details"
                          {...register("details", { required: "This field is required" })}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="type">
                          Type <span className="text-red-500">*</span>
                        </label>

                        <select
                          {...register("type", { required: "This field is required" })} className="form-input" placeholder="Choose"
                        >
                          <option value="" disabled selected hidden>
                            Select an option
                          </option>
                            <option value="quiz" > Quiz </option>
                            <option value="free form"> Free Form</option>
                        </select>
                        
                      </div>
                      <div>
                        <label htmlFor="subject">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("subject", { required: "This field is required" })}
                          className="form-input"
                          placeholder="Choose"
                        >
                          <option value="" disabled selected hidden>
                            Select an option
                          </option>
                          {subjectsOptions?.map((option:any) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
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

export default EditQuestionForm;
