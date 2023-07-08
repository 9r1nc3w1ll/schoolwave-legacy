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
import { getClasses } from '@/apicalls/clas';
import { createExams, getExamsQuestions } from '@/apicalls/exam';
import Select from 'react-select';



const CreateExam  = (props:any) => {

  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Subject'));
  });

  interface classOption {
    id: string;
    name: string;
  }
  interface examsQuestionOption {
    id: string;
    title: string;
  }

  const [classOptions, setclassOptions] = useState<classOption[]>([]);
  const [examsQuestionOptions, setexamsQuestionOptions] = useState<examsQuestionOption[]>([]);
  const [date1, setDate1] = useState<any>('2022-07-05');
  const [selectedClass, setSelectedClass] = useState<string[]>([]);
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

  const { data: clasii, isSuccess, status, refetch } = useQuery('classes', () => getClasses(user_session?.access_token), {enabled: false})
  const { data: examsQuestion, isSuccess:isSuccess2, status:status2, refetch:refetch2 } = useQuery('terms', () => getExamsQuestions(user_session?.access_token), {enabled: false})

  useEffect(()=>{
    if(sessionStatus == 'authenticated'){
      refetch()
      refetch2()
  
    }

  }, [sessionStatus, refetch,refetch2])

  let question_options:any = [];


  useEffect(()=>{
    if(isSuccess && clasii && isSuccess2 && examsQuestion){
        
      setclassOptions(clasii);
      setexamsQuestionOptions(examsQuestion); 
      console.log("This are the exam question",examsQuestion)

     
          
  

      
    }
  },[isSuccess, clasii, isSuccess2, examsQuestion]);


  question_options = examsQuestionOptions.map((option: examsQuestionOption) => ({
        
    value: option.id,
    label: option.title,
  }));

  

  const { register, reset, handleSubmit } = useForm({ shouldUseNativeValidation: true });



          const queryClient = useQueryClient();
          const { mutate, isLoading, error } = useMutation(
            (data:any) =>{
              
              return createExams(user_session?.access_token, data )},
            {
              onSuccess: async (data) => {
                showAlert('success', 'Exam created Successfully')
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
            const updatedData = { ...data, questions: extractedQuestions };
          
            mutate(updatedData);
          };

        
            
          let class_options:any = [];
          
          class_options = classOptions.map((option:any) => ({
            
            label: option.title,
            value: option.id,
          }));
      
        
          const handleQuestionChange = (selectedOptions: any) => {
            setSelectedQuestions(selectedOptions);
          };

        
            
        
          
         


          return (

            <div className='panel flex-1 px-3 py-6 ltr:xl:mr-6 rtl:xl:ml-6 w-50%' > 
              <div className="w-full pt-0 mt-0 border-b-2 "> 
                <div className='pl-3 font-bold text-base'> Create Exam</div> 
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>

                <div className='px-2 py-4 '>
                  <div className='font-bold py-6  text-xl'> Exam  Details</div>

                  <div className=' grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-5'>

                    <div className=''> 
                      <label htmlFor="name">  Name <span className='text-red-500'>*</span></label>
                      <input placeholder='English' {...register("name", { required: "This field is required" }, )}    className='form-input'/>
                    </div>
                    <div className=''> 
                      <label htmlFor="description"> Exam Description <span className='text-red-500'>*</span></label>
                      <input placeholder='Literature in english' {...register("description", { required: "This field is required" })}   className='form-input'/>
                    </div>

                    <div className=''> 
                      <label htmlFor="start_date"> Exam Start Date <span className='text-red-500'>*</span></label>
                      <input type="date" {...register("start_date", { required: "This field is required" })}   className='form-input'/>
                    </div>

                    <div className=''> 
                      <label htmlFor="due_date"> Due Date <span className='text-red-500'>*</span></label>
                      <input type="date" {...register("due_date", { required: "This field is required" })}   className='form-input'/>
                    </div>

                    <div className=''> 
                      <label htmlFor="weight"> Weight <span className='text-red-500'>*</span></label>
                      <input placeholder='-2' {...register("weight", { required: "This field is required" })}   className='form-input'/>
                    </div>

                    <div className=''> 
                      <label htmlFor="class_name"> Class Name <span className='text-red-500'>*</span></label>

{/* 
                      <Select
                                placeholder="Select an option"
                                options={question_options}
                                isMulti
                                isSearchable={true}
                                value={selectedQuestions}
                                onChange={handleQuestionchange }
                              /> */}
                    
                      <select {...register('class_name', { required: "This field is required" })}  className='form-input' placeholder=
'Choose' >
                        <option value="" disabled selected hidden>
                          Select an option
                        </option>
                        {classOptions?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className=''> 
                      <label htmlFor="term"> Question <span className='text-red-500'>*</span></label>

                         
                      <Select
            placeholder="Select an option"
            options={question_options}
            isMulti
            isSearchable
            value={selectedQuestions}
            onChange={handleQuestionChange}
          />
                    </div> 
      


                  </div>
                   
                  <button type="submit" className="btn btn-primary !mt-6 ">
        Save
                  </button>

                </div>
              </form>
            </div>

          )};

export default CreateExam ;