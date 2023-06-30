import Link from 'next/link';
import { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { getUser } from '@/apicalls/users';
import { getClasses } from '@/apicalls/clas';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { toUpper } from 'lodash';
import { Dialog, Transition } from '@headlessui/react';
import EditClassForm from '@/components/EditClassForm';
import { useSession } from 'next-auth/react';
import StudentList from '@/components/StudentList';
import StaffList from '@/components/StaffList';



const AccountSetting = (props:any) => {

  interface Class {
    id: number;
    description: string;
    class_index:number;
    code:number;

    // Add other properties of a class here
  }
    const [selectedSession, setSelectedSession] = useState<any>({});
    const [modal, setmodal] = useState(false);

  
  const [classDetails, setClassDetails] = useState<Class | null>(null);

  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();
  const { data: classes, isSuccess, status, isLoading, refetch } = useQuery('classes', () => 
  getClasses(user_session?.access_token), {enabled: false})
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

  const classId = router.query.id
  
  useEffect(() =>{
       if (isSuccess && classes.data) {
        const selectedClass = classes.data.find((cls:Class) => cls.id === classId);
        setClassDetails(selectedClass || null);
         }
       }, [isSuccess, classes, classId]);

       if (!classDetails) {
        return <div>Loading...</div>;
      }
 


  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/class" className="text-primary hover:underline">
          Class
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Class Details</span>
        </li>
      </ul>
      <div className="pt-5">
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">Class Details</h5>
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
                onClick={() => toggleTabs('list-of-students')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'list-of-students' ? '!border-primary text-primary' : ''}`}
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
                                List of Students
              </button>
            </li>
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('list-of-staffs')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'list-of-staffs' ? '!border-primary text-primary' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                                Staff
              </button> 
            </li>
            
          </ul>
        </div>
        {tabs === 'home' ? (
          <div>
            {
              classDetails ?
                <div className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                  <h6 className="mb-5 text-lg font-bold">General Information</h6>
                  <div className='md:grid grid-cols-3 gap-1'>
                    <img className="w-3/4 rounded-md overflow-hidden object-cover col-span-1" src="/assets/images/profile-12.jpeg" alt="img" />
                    <div className='col-span-2 '> 
                      <h1 className='text-4xl text-primary '>{toUpper( classDetails.name) }</h1>
                      <div className='md:grid grid-cols-2 w-full gap-6  '>
                        
                        <div className=' ' >  


                        
      <table className='text-left mt-5 md:flex-wrap '>
        <thead >
            <tr>
                <th>ID: </th>
                <td><div className="whitespace-nowrap">{classDetails.id}</div></td>
                
            </tr>
            </thead>

        
        <tbody>
          <tr>
            <th>Description:</th>
            <td>{classDetails.description}</td>
          </tr>
          <tr>
          <th>Level:</th>
          <td>{classDetails.class_index}</td>
          </tr>
          <tr>
          <th>Number of Students:</th>
          
          </tr>
          <tr>
          <th>Class code:</th>
          <td> {classDetails.code}</td>
          </tr>

          <tr>
          <th>Teacher:</th>

          </tr>
          
          
                
                  
            
        </tbody>
    </table>

                          </div> 
                      </div>
                    </div>
                  </div>
                  
                </div> : <p> Loading Student Data </p>
            }
          
          </div>
        ) : (
          ''
        )}
        {tabs === 'list-of-students' ? (
          <StudentList/>
        ) : (
          ''
        )}
        {tabs === 'list-of-staffs' ? (
          <StaffList/>
        ) : (
          ''
        )}
      </div>
    </div>
    
  );
};

export default AccountSetting;