import Link from 'next/link';
import { useEffect, useState } from 'react';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { toUpper } from 'lodash';
import { useSession } from 'next-auth/react';
import StudentList from '@/components/StudentList';
import StaffList from '@/components/StaffList';
import { getSingleExam } from '@/apicalls/exam';
import ExamQuestionList from '@/components/ExamQuestionList';

const AccountSetting = (props: any) => {
  interface Class {
    id: number;

    name: string;
    description: string;
    start_date: string;
    due_date: string;
    weight: string;

    // Add other properties of a exam here
  }
  const [selectedSession, setSelectedSession] = useState<any>({});
  const [modal, setmodal] = useState(false);

  const router = useRouter();
  const examId = router?.query?.id;

  const [examDetails, setExamDetails] = useState<Class | null>(null);

  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();

  const {
    data: examData,
    isSuccess,
    status,
    isLoading,
    refetch,
  } = useQuery(
    'examData',
    () => getSingleExam(examId, user_session?.access_token),
    { enabled: false }
  );
  useEffect(() => {
    if (sessionStatus == 'authenticated') {
      refetch();
      console.log('Working now', examData);
    } else {
      console.log('Not working');
    }
  }, [sessionStatus, refetch, isSuccess]);
  const [editModal, seteditModal] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle('Account Setting'));
  });
  const [tabs, setTabs] = useState<string>('home');
  const toggleTabs = (name: string) => {
    setTabs(name);
  };

  useEffect(() => {
    if (isSuccess && examData) {
      setExamDetails(examData || null);
    }
  }, [isSuccess, examData, examId]);

  if (!examDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul className='flex space-x-2 rtl:space-x-reverse'>
        <li>
          <Link href='/exam' className='text-primary hover:underline'>
            Exam
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Exam Details</span>
        </li>
      </ul>
      <div className='pt-5'>
        <div className='mb-5 flex items-center justify-between'>
          <h5 className='text-lg font-semibold dark:text-white-light'>
            {examDetails.name}
          </h5>
        </div>
        <div>
          <ul className='mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex'>
            <li className='inline-block'>
              <button
                onClick={() => toggleTabs('home')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${
                  tabs === 'home' ? '!border-primary text-primary' : ''
                }`}
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                >
                  <path
                    opacity='0.5'
                    d='M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M12 15L12 18'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                </svg>
                Basic Information
              </button>
            </li>
            <li className='inline-block'>
              <button
                onClick={() => toggleTabs('list-of-exam-question')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${
                  tabs === 'list-of-exam-question'
                    ? '!border-primary text-primary'
                    : ''
                }`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M4 8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8Z'
                    stroke='#1C274D'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M19.8978 16H7.89778C6.96781 16 6.50282 16 6.12132 16.1022C5.08604 16.3796 4.2774 17.1883 4 18.2235'
                    stroke='#1C274D'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M8 7H16'
                    stroke='#1C274D'
                    strokeWidth='1.5'
                    stroke-linecap='round'
                  />
                  <path
                    d='M8 10.5H13'
                    stroke='#1C274D'
                    strokeWidth='1.5'
                    stroke-linecap='round'
                  />
                  <path
                    d='M19.5 19H8'
                    stroke='#1C274D'
                    strokeWidth='1.5'
                    stroke-linecap='round'
                  />
                </svg>
                List of Exam Question
              </button>
            </li>
            <li className='inline-block'>
              <button
                onClick={() => toggleTabs('list-of-staffs')}
                className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${
                  tabs === 'list-of-staffs'
                    ? '!border-primary text-primary'
                    : ''
                }`}
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle
                    cx='12'
                    cy='6'
                    r='4'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  />
                  <ellipse
                    opacity='0.5'
                    cx='12'
                    cy='17'
                    rx='7'
                    ry='4'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  />
                </svg>
                Staff
              </button>
            </li>
          </ul>
        </div>
        {tabs === 'home' ? (
          <div>
            {examDetails ? (
              <div className='mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black'>
                <h6 className='mb-5 text-lg font-bold'>General Information</h6>
                <div className='grid-cols-3 gap-1 md:grid'>
                  <img
                    className='col-span-1 w-3/4 overflow-hidden rounded-md object-cover'
                    src='/assets/images/profile-12.jpeg'
                    alt='img'
                  />
                  <div className='col-span-2 '>
                    <h1 className='text-4xl text-primary '>
                      {toUpper(examDetails.name)}
                    </h1>
                    <div className='w-full grid-cols-2 gap-6 md:grid  '>
                      <div className=' '>
                        <table className='mt-5 text-left md:flex-wrap '>
                          <thead>
                            <tr>
                              <th>ID: </th>
                              <td>
                                <div className='whitespace-nowrap'>
                                  {examDetails.id}
                                </div>
                              </td>
                            </tr>
                          </thead>

                          <tbody>
                            <tr>
                              <th>Description:</th>
                              <td>{examDetails.description}</td>
                            </tr>
                            <tr>
                              <th>Start Date</th>
                              <td>{examDetails.start_date}</td>
                            </tr>
                            <tr>
                              <th>Due Date</th>
                              <td> {examDetails.due_date}</td>
                            </tr>
                            <tr>
                              <th>Weight</th>
                              <td> {examDetails.weight}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p> Loading Exam Data </p>
            )}
          </div>
        ) : (
          ''
        )}
        {tabs === 'list-of-exam-question' ? (
          <ExamQuestionList examId={examId} />
        ) : (
          ''
        )}
        {tabs === 'list-of-staffs' ? <StaffList examId={examId} /> : ''}
      </div>
    </div>
  );
};

export default AccountSetting;
