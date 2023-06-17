import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { EditUser, getUser } from '@/apicalls/users';

import { useRouter } from 'next/router';
import { dirtyValues } from '@/utility_methods/form';




const EditEmployee  = (props:any) => {

  const router = useRouter()
  const {data:studentData, isSuccess:studentDataSuccessful, status:studentDataStatus, isLoading:studentDataLoading} = useQuery('getStudent', ()=>{
    if(router){
      return getUser(props.access_token, {"id":props.id} )
    }
  })

  useEffect(()=>{
    if(studentData){
      reset(studentData)
    }
  }, [studentData, studentDataStatus])

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Edit Employee'));
  });
  const [date1, setDate1] = useState<any>('2022-07-05');

        
         
  const { register, reset, handleSubmit, formState } = useForm({ shouldUseNativeValidation: true });

          type FormData = {
            username: string;
            first_name: string;
            last_name: string;
            email: string;
            password: string;
            date_of_birth:string;
            gender: string;
            blood_group:string;
            religion:string;
            phone_number: string;
            city: string;
            state: string;
            address: string;
            guardian_name:string;
            relation: string;
            guardian_occupation:string;
            guardian_phone_number: string;
            guardian_address: string;
            // Define other form fields here
          };
          
   
         
        
          const queryClient = useQueryClient();
          const { mutate, isLoading, error } = useMutation(
            (data) =>
              EditUser(props.access_token, data, props.id),
            {
              onSuccess: async (data) => {
                showAlert('success', 'Saved Successfuly')
                queryClient.invalidateQueries(['getStaffs'])
                props.seteditModal(false)
  
              },
              onError: (error:any) => {
                let x =error.response.data.message.split(' ')

                if(x.indexOf('duplicate') >=0 && x.indexOf('key') >=0  && x.indexOf('constraint') >=0){

                  showAlert('error', 'A session with same Start Date or End Date already exist')
                }else{
                  showAlert('error', 'An Error Occured' )
                }
              }
            }
          );
  
          const onSubmit = async (data: any) => { 
            let updatedValue: any = dirtyValues(formState.dirtyFields, data)
            mutate(updatedValue)
          
          
    
          };
        

          return (

            <div className='panel flex-1 px-3 py-6 ltr:xl:mr-6 rtl:xl:ml-6' > 
              <div className="w-full pt-0 mt-0 border-b-2 "> 
                <div className='pl-3 font-bold text-lg'> Edit Employee Details</div> 
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>

                <div className='px-2 py-4 '>
                  <div className='font-bold py-6  text-lg'> Basic Details</div>

                  <div className=' grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-5'>

                    <div className='my-3'> 
                      <label htmlFor="first_name"> First Name <span className='text-red-500'>*</span></label>
                      <input {...register("first_name", {})}    className='form-input'/>
                    </div>
                    <div className='my-3'> 
                      <label htmlFor="last_name"> Last Name <span className='text-red-500'>*</span></label>
                      <input {...register("last_name", {})}   className='form-input'/>
                    </div>

                    <div className='my-3'> 
                      <label htmlFor="email"> email <span className='text-red-500'>*</span></label>
                      <input {...register("email", {})}   className='form-input'/>
                    </div>
                    <div className='my-3'> 
                      <label htmlFor="username"> User Name <span className='text-red-500'>*</span></label>
                      <input  className='form-input' {...register("username", {})} />
                    </div>


                    <div className='my-3'> 
                      <label htmlFor="gender"> Gender <span className='text-red-500'>*</span></label>

                      <select {...register('gender', {})}  className='form-input' >
                        <option value= ''>-- select an option --</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                      </select>
                    </div>

                    <div className='my-3'> 
                      <label htmlFor="bloogGroup"> Staff Role <span className='text-red-500'>*</span></label>
                      <select {...register('role', {})}  className='form-input'>
                        <option value= ''>-- select an option --</option>
                        <option value= 'admin'>Admin </option>
                        <option value= 'teacher'>Teacher </option>
                        <option value= 'staff'>Staff </option>

       
                      </select>
                    </div>

                    <div className='my-3'> 
                      <label htmlFor="religion">Religion <span className='text-red-500'>*</span></label>
                      <input {...register("religion", {})}  className='form-input'/>
                    </div>

                    <div className='my-3'> 
                      <label htmlFor="phone_number"> Mobile No <span className='text-red-500'>*</span></label>
                      <input {...register("phone_number", {})}  className='form-input'/>
                    </div>

                    <div className='my-3'> 
                      <label htmlFor="city"> City <span className='text-red-500'>*</span></label>
                      <input {...register("city", {})}    className='form-input'/>
                    </div>

                    <div className='my-3'> 
                      <label htmlFor="state"> State <span className='text-red-500'>*</span></label>
                      <input {...register("state", {})}  className='form-input'/>
                    </div>
                  </div>
                  <div className='my-3'> 
                    <label htmlFor="address"> Address <span className='text-red-500'>*</span></label>
                    <textarea id="ctnTextarea" rows={3} className="form-textarea" {...register("address", {})} placeholder="Enter Address" required></textarea>
                  </div>



                  <button type="submit" className="btn btn-primary !mt-6 w-[15%] ">
Save
                  </button>



                </div>
              </form>
            </div>
    
          )};

export default EditEmployee;