import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {parse} from 'json2csv'
import { useSession } from 'next-auth/react';
import { BulkAdmissionUpload } from '@/apicalls/admissions';
import { CreateSubject } from '@/apicalls/subjects';
import Placeholder from 'react-select/dist/declarations/src/components/Placeholder';





const Subject  = (props:any) => {
  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Subject'));
  });
  const [date1, setDate1] = useState<any>('2022-07-05');



  const { register, reset, handleSubmit, } = useForm({ shouldUseNativeValidation: true });

          type FormData = {
            name: string,
            description: string,
            code: string,
            class_id: string,
            term: string,
            // Define other form fields here
          };


  

          const queryClient = useQueryClient();
          const { mutate, isLoading, error } = useMutation(
            (data:any) =>{
           
              return CreateSubject( data, user_session?.access_token)},
            {
              onSuccess: async (data) => {
                showAlert('success', 'Subject created Successfully')
                reset();
                props.refreshSubject()
                props.setmodal(false)

              },
              onError: (error:any) => {
                showAlert('error', 'An Error Occured' )
             
              }
            }
          );

          const onSubmit = async (data: any) => { 
               
            console.log(data)
           
          };


          return (

            <div className='panel flex-1 px-3 py-6 ltr:xl:mr-6 rtl:xl:ml-6' > 
              <div className="w-full pt-0 mt-0 border-b-2 "> 
                <div className='pl-3 font-bold text-base'> Create Subject</div> 
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>

                <div className='px-2 py-4 '>
                  <div className='font-bold py-6  text-xl'> Subject Details</div>

                  <div className=' grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-5'>

                    <div className='my-3'> 
                      <label htmlFor="name">  Name <span className='text-red-500'>*</span></label>
                      <input placeholder='English' {...register("name", { required: "This field is required" }, )}    className='form-input'/>
                    </div>
                    <div className='my-3'> 
                      <label htmlFor="description"> Subject Description <span className='text-red-500'>*</span></label>
                      <input placeholder='Literature in english' {...register("description", { required: "This field is required" })}   className='form-input'/>
                    </div>

                    <div className='my-3'> 
                      <label htmlFor="code"> Subject Code<span className='text-red-500'>*</span></label>
                      <input placeholder='ENG1 101' {...register("code", { required: "This field is required" })}   className='form-input'/>
                    </div>
                    <div className='my-3'> 
                      <label htmlFor="class_id"> Class ID <span className='text-red-500'>*</span></label>
                      <input placeholder='244' className='form-input' {...register("class_id", { required: "This field is required" })} />
                    </div>

                    <div className='my-3'> 
                      <label htmlFor="term"> Term <span className='text-red-500'>*</span></label>
                      <input placeholder='2022-2023'{...register("term",{ required: "This field is required" })}   className='form-input' />
                    </div>


                  


                  </div>
                   
                  <button type="submit" className="btn btn-primary !mt-6 ">
        Save
                    </button>

                </div>
              </form>
            </div>

          )};

export default Subject;