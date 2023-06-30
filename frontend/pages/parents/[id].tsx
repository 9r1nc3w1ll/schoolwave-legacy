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
import ChildrenList from '@/components/ChildrenList';
import FeesList from '@/components/FeesList';
import ParentLog from '@/components/Parentlog';


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
    dispatch(setPageTitle('Account Setting'));
  });
  const [tabs, setTabs] = useState<string>('home');
  const toggleTabs = (name: string) => {
    setTabs(name);
  };

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/employees" className="text-primary hover:underline">
          Parents
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Parent Details</span>
        </li>
      </ul>
      <div className="pt-5">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">Parent Details</h5>
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
                onClick={() => toggleTabs('children-details')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'children-details' ? '!border-primary text-primary' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                                Children
              </button>
            </li>
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('fees')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'fees' ? '!border-primary text-primary' : ''}`}
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
                                Fees
              </button>
            </li>
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('login-info')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'login-info' ? '!border-primary text-primary' : ''}`}
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
                                Login Details
              </button>
            </li>
          </ul>
        </div>
        {tabs === 'home' ? (
          <div>
            {
              student && student.role == 'parent' ?
                <div className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                  <h6 className="mb-5 text-lg font-bold">General Information</h6>
                  <div className='md:grid grid-cols-3 gap-1'>
                    <img className="w-3/4 rounded-md overflow-hidden object-cover col-span-1" src="/assets/images/profile-12.jpeg" alt="img" />
                    <div className='col-span-2'> 
                      <h1 className='text-4xl text-primary '>{toUpper( student.first_name) + ' ' + toUpper(student.last_name)}</h1>
                      <div className='md:grid grid-cols-2 w-full gap-6 '>
                        <div >
                         
                          <table className='text-left mt-5 md:flex-wrap '>
                      <thead >
                    <tr>
                      <th>ID: </th>
                      <td><div className="whitespace-nowrap">{student.id}</div></td>
                
                    </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Gender: </th>
                          <td>{student.gender}</td>
                        </tr>
                        <tr>
                        <th>Role: </th>
                        <td>{student.role}</td>
                        </tr>
                        <tr>
                        <th>Phone No.:</th>
                        <td>{student.phone_number }</td>
                        </tr>
                        <tr>
                        <th>Address.: </th>
                        <td> {student.address}</td>
                        </tr>
                    </tbody>
                  </table>
                        </div>
                        </div>
                    </div>
                  </div>
                  <div className='mt-8'>
                  </div> 
                </div> : <p> Loading Student Data </p>
            }

          </div>
        ) : (
          ''
        )}
        {tabs === 'children-details' ? (
          <div>
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-1">
              <div className="panel">
              <ChildrenList/>

               </div>
            </div>
          </div>
        ) : (
          ''
        )}
        {tabs === 'fees' ? (
          <div className="switch">
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-1">
              <FeesList/>
              
            </div>
          </div>
        ) : (
          ''
        )}
        {tabs === 'login-info' ? (
          <div className="switch">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-1">

              <ParentLog/>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default AccountSetting;