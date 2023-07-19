import { PropsWithChildren, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { editSubject } from '@/apicalls/subjects';
import {  useState } from 'react';
import { getClasses } from '@/apicalls/class-api';
import { getTerms } from '@/apicalls/session';
import Select from 'react-select';
import { editExam, getExamsQuestions  } from '@/apicalls/exam';
import { getSubjects } from '@/apicalls/subjects';







const EditExamForm = (props:any) => {

  const { register, handleSubmit, reset, setValue } = useForm({ shouldUseNativeValidation: true });
 
  const queryClient = useQueryClient();
  useEffect(()=>{
    reset(props.sessionData)
  },[])
  const { mutate, isLoading, error } = useMutation(
    (data) => editExam(props.sessionData.id, props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Exam Edited Successfuly')
        props.exit(false)
        props.refreshClasses()
  
      },
      onError: (error) => {
        showAlert('error', 'An Error Occured' )
      }
    }
  );
  


  const { data: clasii, isSuccess, status, refetch } = useQuery('classes', () => getClasses(props.user_session?.access_token), {enabled: false})
  const { data: subjects, isSuccess:isSuccess3, status:status3, refetch:refetch3 } = useQuery('terms', () => getSubjects(props.user_session?.access_token), {enabled: false})
  const { data: examsQuestions, isSuccess:isSuccess2, status:status2, refetch:refetch2 } = useQuery('examquestionss', () => getExamsQuestions(props.user_session?.access_token), {enabled: false})
  interface classOption {
    id: string;
    name: string;
  }
  interface examsQuestionOption {
    id: string;
    title: string;
  }
  interface subjectsOption {
    id: string;
    name: string;
  }


  const [subjectsOptions, setsubjectsOptions] = useState<subjectsOption[]>([]);
  const [classOptions, setclassOptions] = useState<classOption[]>([]);
  const [examquestionsOptions, setexamquestionsOptions] = useState<examsQuestionOption[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);


  useEffect(()=>{
  
    
    setclassOptions(clasii)
    setexamquestionsOptions(examsQuestions)
    setsubjectsOptions(subjects); 
    refetch()
    refetch2()
    refetch3()
  
  } 
  );

  let question_options:any = [];


  question_options = examquestionsOptions?.map((option: examsQuestionOption) => ({
        
    value: option.id,
    label: option.title,
  }));

  const handleQuestionChange = (selectedOptions: any) => {
    setSelectedQuestions(selectedOptions);
  };



  const onSubmit = async (data: any) => { 
   
    mutate(data); };

  useEffect(() => {
    if (props.sessionData) {
      setValue("name", props.sessionData.name);
      setValue("description", props.sessionData.description); // Update the field name from "code" to "description"
      setValue("start_date", props.sessionData.start_date);
      setValue("due_date", props.sessionData.due_date);
      setValue("weight", props.sessionData.weight);
      setValue("class_name", props.sessionData.class_name);
      setValue("questions", props.sessionData.questions);


    }
  }, [props.sessionData, setValue]);

  return (
    <div  className="">
      <form className="space-y-5"   onSubmit={handleSubmit(onSubmit)}>
      
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text"  className="form-input" {...register("name", { required: "This field is required" })} />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <input id="description" type="text"  className="form-input" {...register("description", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="start_date"> Start Date</label>
          <input id="start_date" type="date"  className="form-input" {...register("start_date", { required: "This field is required" })} />
          
        </div>

        <div>
          <label htmlFor="due_dat"> Due Date</label>
          <input id="due_date" type="date"  className="form-input" {...register("due_date", { required: "This field is required" })} />
          
        </div>

        <div>
          <label htmlFor="weight"> Weight</label>
          <input id="weight" type="number"  className="form-input" {...register("weight", { required: "This field is required" })} />
          
        </div>

        <div>
          <label htmlFor="class_name">Class</label>
          <select
            id="class_name"
            className="form-input"
            {...register("class_name", { required: "This field is required" })}
          >
            <option>Select an option</option>
            {classOptions?.map((option) => (
              <option 
                key={option.id}
                value={option.id}
                selected={option.id === props.sessionData?.class_id}
              >
                {option.name}
              </option>
            ))}
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
                          {subjectsOptions?.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
        <div>
          <label htmlFor="questions">Questions</label>
          <Select
            placeholder="Select an option"
            options={question_options}
            isMulti
            isSearchable
            {...register("questions", { required: "This field is required" })}
            value={selectedQuestions}
            onChange={handleQuestionChange}
          />
          
         
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

export default EditExamForm;
