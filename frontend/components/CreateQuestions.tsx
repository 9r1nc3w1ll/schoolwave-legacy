import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {parse} from 'json2csv'
import { useSession } from 'next-auth/react';
import { createExamQuestion } from '@/apicalls/exam';
import { getSubjects } from '@/apicalls/subjects';
import Select from 'react-select';



const CreateExamQuestions  = (props:any) => {

  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Subject'));
  });


  interface subjectsOption {
    id: string;
    name: string;
  }


  const [subjectsOptions, setsubjectsOptions] = useState<subjectsOption[]>([]);
  const [date1, setDate1] = useState<any>('2022-07-05');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  
  type FormData = {
    name: string;
    description: string;
    start_date: string;
    due_date: string;
    weight: string;
    class_name: string;
    selectedQuestions: string[];
    // Add other form fields here
  };


  const { data: subjects, isSuccess:isSuccess2, status:status2, refetch:refetch2 } = useQuery('terms', () => getSubjects(user_session?.access_token), {enabled: false})

  useEffect(()=>{
    if(sessionStatus == 'authenticated'){
      refetch2()
  
    }

  }, [sessionStatus,refetch2])

  let subjects_options:any = [];


  useEffect(()=>{
    if( isSuccess2 && subjects){
        
      setsubjectsOptions(subjects); 
      

     
          
  

      
    }
  },[ isSuccess2, subjects]);


  subjects_options = subjects?.map((option: subjectsOption) => ({
        
    value: option.id,
    label: option.name,
  }));

  

  const { register, reset, handleSubmit } = useForm({ shouldUseNativeValidation: true });



          const queryClient = useQueryClient();
          const { mutate, isLoading, error } = useMutation(
            (data:any) =>{
              
              return createExamQuestion(user_session?.access_token, data )},
            {
              onSuccess: async (data) => {
                showAlert('success', 'Questions created Successfully')
                reset();
                props.refreshClass()
                props.setmodal(false)

              },
              onError: (error) => {
                showAlert('error', 'An Error Occured' )
             
              }
            }
          );

        const onSubmit = async (data: any) => {
            const extractedQuestions = selectedQuestions.map((value: any) => value.value);
            const updatedData = { ...data, subjects: extractedQuestions, school: user_session?.school.id };
          
            mutate(updatedData);
          };

        

      
        
          const handleQuestionChange = (selectedOptions: any) => {
            setSelectedQuestions(selectedOptions);
          };

        
            
        
          
         


          return (

            <div className="panel flex-1 px-3 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                  <div className="w-full pt-0 mt-0 border-b-2">
                    <div className="pl-3 font-bold text-base">Create Exam Question</div>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} className="px-2 py-4">
                    <div className="font-bold py-6 text-xl">Question Details</div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 ">
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
                      <label htmlFor="type"> Type <span className="text-red-500">*</span>  </label>
                      
                      <select
                          {...register("type", { required: "This field is required" })}
                          className="form-input"
                          placeholder="Choose"
                        >
                          <option value="" disabled selected hidden> Select an option </option>
                          <option value="quiz" > Quiz </option>
                          <option value="free form" > Free Form </option>
                          
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
                    </div>
                    <button type="submit" className="btn btn-primary mt-6">
                      Save
                    </button>
                  </form>
                </div>
                )};


export default CreateExamQuestions ;