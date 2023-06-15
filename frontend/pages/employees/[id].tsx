import React from 'react';
import Link from 'next/link';
import { useEffect, useState, Fragment } from 'react';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { getUser } from '@/apicalls/users';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { toUpper } from 'lodash';
import { Dialog, Transition } from '@headlessui/react';
import EditEmployee from '@/components/EditEmployee';
import { useSession } from 'next-auth/react';


const AccountSetting = (props:any) => {
  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();
  const {data:student, isSuccess, refetch } = useQuery('getUser', ()=>{
    return getUser(user_session?.access_token, router.query )
  }, {enabled: false})
  useEffect(() => {
    if(sessionStatus == 'authenticated'){
      refetch()
    }

  }, [sessionStatus, refetch]);
  const [editModal, seteditModal] = useState(false);
  const router = useRouter()

  useEffect(() => {
    dispatch(setPageTitle('Admission Request'));
  });
  const [date1, setDate1] = useState<any>('2022-07-05');

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/employees" className="text-primary hover:underline">
          Employees
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Employee Details</span>
        </li>
      </ul>
      <div className="pt-5">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">Employee Details</h5>
        </div>
        <div>
          <ul className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('home')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                  <path
                    opacity="0.5"
                    d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M12 15L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                                Basic Information
              </button>
            </li>
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('payment-details')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'payment-details' ? '!border-primary text-primary' : ''}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                  <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 6V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path
                    d="M15 9.5C15 8.11929 13.6569 7 12 7C10.3431 7 9 8.11929 9 9.5C9 10.8807 10.3431 12 12 12C13.6569 12 15 13.1193 15 14.5C15 15.8807 13.6569 17 12 17C10.3431 17 9 15.8807 9 14.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                                Payment Details
              </button>
            </li>
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('preferences')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'preferences' ? '!border-primary text-primary' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                                Preferences
              </button>
            </li>
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('danger-zone')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'danger-zone' ? '!border-primary text-primary' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.00659 6.93309C5.04956 5.7996 5.70084 4.77423 6.53785 3.93723C7.9308 2.54428 10.1532 2.73144 11.0376 4.31617L11.6866 5.4791C12.2723 6.52858 12.0372 7.90533 11.1147 8.8278M17.067 18.9934C18.2004 18.9505 19.2258 18.2992 20.0628 17.4622C21.4558 16.0692 21.2686 13.8468 19.6839 12.9624L18.5209 12.3134C17.4715 11.7277 16.0947 11.9628 15.1722 12.8853"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    opacity="0.5"
                    d="M5.00655 6.93311C4.93421 8.84124 5.41713 12.0817 8.6677 15.3323C11.9183 18.5829 15.1588 19.0658 17.0669 18.9935M15.1722 12.8853C15.1722 12.8853 14.0532 14.0042 12.0245 11.9755C9.99578 9.94676 11.1147 8.82782 11.1147 8.82782"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                                Danger Zone
              </button>
            </li>
          </ul>
        </div>
        {tabs === 'home' ? (
          <div>
            {
              student ?
                <div className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                  <h6 className="mb-5 text-lg font-bold">General Information</h6>
                  <div className='md:grid grid-cols-3 gap-1'>
                    <img className="w-3/4 rounded-md overflow-hidden object-cover col-span-1" src="/assets/images/profile-12.jpeg" alt="img" />
                    <div className='col-span-2'> 
                      <h1 className='text-4xl text-primary '>{toUpper( student.first_name) + ' ' + toUpper(student.last_name)}</h1>
                      <div className='md:grid grid-cols-2 w-full gap-6 ml-[-35%]'>
                        <div >
                          <p className='text-right mt-4 '>Gender:  </p>
                          <p className='text-right mt-4 '>Role:  </p>
                          <p className='text-right mt-4 '> Phone No.: </p>
                          <p className='text-right mt-4 '>Address.:  </p>
                        </div>
                        <div className=''  >  
                          <p className='text-left mt-4 '>{student.gender}</p>
                          <p className='text-left mt-4 '>{student.role}</p>
                          <p className=' text-left mt-4 '>{student.phone_number }</p>
                          <p className='text-left  mt-4'>{student.address}</p></div> 
                      </div>
                    </div>
                  </div>
                  <div className='mt-8'>
                    <button className= 'block w-[20%] bg-primary text-white mx-auto flex justify-center px-5 py-3 text-lg' onClick={()=>{
                      seteditModal(true)
                    }} >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>

                            Edit
                    </button> </div> 
                </div> : <p> Loading Student Data </p>
            }
          
            <Transition appear show={editModal} as={Fragment}>
              <Dialog as="div" open={editModal} onClose={() => seteditModal(false)}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0" />
                </Transition.Child>
                <div id="fadein_left_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                  <div className="flex items-start justify-center min-h-screen px-4">
                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark animate__animated animate__fadeInDown">
                      <div className="w-4/5 mx-auto py-5">
                                         
                        <EditEmployee access_token={user_session?.access_token} id={ router.query?.id} seteditModal={seteditModal} refreshEmployee={refetch} />
                      </div>
                    </Dialog.Panel>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        ) : (
          ''
        )}
        {tabs === 'payment-details' ? (
          <div>
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="panel">
                <div className="mb-5">
                  <h5 className="mb-4 text-lg font-semibold">Billing Address</h5>
                  <p>
                                        Changes to your <span className="text-primary">Billing</span> information will take effect starting with scheduled payment and will be refelected on your next
                                        invoice.
                  </p>
                </div>
                <div className="mb-5">
                  <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                    <div className="flex items-start justify-between py-3">
                      <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                                                Address #1
                        <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">2249 Caynor Circle, New Brunswick, New Jersey</span>
                      </h6>
                      <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                        <button className="btn btn-dark">Edit</button>
                      </div>
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
                      <label htmlFor="date_of_birth"> Date of Birth <span className='text-red-500'>*</span> </label>
                      <Flatpickr value={date1} {...register("date_of_birth",{})}  options={{ dateFormat: 'Y-m-d' }} className="form-input" onChange={(date) => setDate1(date)} />
            
                    </div>
      

                    <div className='my-3'> 
                      <label htmlFor="gender"> Gender <span className='text-red-500'>*</span></label>
            
                      <select {...register('gender', {})}  className='form-input' placeholder='Choose' >
                        <option value="male">male</option>
                        <option value="female">female</option>
                      </select>
                    </div>

                    <div className='my-3'> 
                      <label htmlFor="bloogGroup"> Blood group <span className='text-red-500'>*</span></label>
                      <select {...register('blood_group', {})}  className='form-input' placeholder='Choose'>
                        <option value= 'O+'>O+</option> 
                        <option value= 'O+'>O+ </option>
                        <option value= 'A+'>A+</option>
                        <option value= 'A-'>A-</option>
                        <option value= 'B+'>B+</option>
                        <option value= 'B-'>B- </option>
                        <option value= 'AB+'>AB+</option> 
                        <option value= 'AB-'>AB-</option> 
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

        

     
                  <div className='px-2 py-4 '>
                    <div className='font-bold py-6 text-lg'> Guardain details</div>
                    <div className=' grid grid-cols-2 gap-5'>
                      <div className='my-3'> 
                        <label htmlFor="guardian_name"> Name <span className='text-red-500'>*</span></label>
                        <input {...register("guardian_name", {})}   className='form-input' />
                      </div>
        
                      <div className='my-3'> 
                        <label htmlFor="relation"> Relation <span className='text-red-500'>*</span></label>
                        <input type="text" name="relation" className='form-input' placeholder='REM-10011'/>
                      </div>
                      <div className='my-3'> 
                        <label htmlFor="guardian_occupation"> Guardian Occupation <span className='text-red-500'>*</span></label>
                        <input {...register("guardian_occupation", {})}   className='form-input' />
                      </div>
                      <div className='my-3'> 
                        <label htmlFor="guardian_phone_number"> Guardian Phone Number <span className='text-red-500'>*</span><span className='text-red-500'>*</span></label>
                        <input {...register("guardian_phone_number", {})}    className='form-input ltr:rounded-l-none rtl:rounded-r-none"'/>
            
                      </div>
                  
        
                    </div>
                    <div className='my-3'> 
                      <label htmlFor="guardian_address"> Guardian Address<span className='text-red-500'>*</span></label>
                      <textarea id="ctnTextarea" rows={3} className="form-textarea" {...register("guardian_address", {})} placeholder="Enter Address" required></textarea>
           
                    </div>
                    <button type="submit" className="btn btn-primary !mt-6 w-[15%] ">
        Save
                    </button>
          
           
                  </div>

                </div>
              </form>
            </div>
    
          )};

export default Admission;