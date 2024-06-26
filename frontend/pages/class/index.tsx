import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useEffect, useState, Fragment, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DeleteClasses from '@/components/DeleteClasses';
import CreateClassForm from '@/components/CreateClassForm';
import EditClassForm from '@/components/EditClassForm';
import { createClass, getClasses } from '@/api-calls/class-api';
import DropDownWIthChildren from '@/components/DropDownWIthChildren';
import { showAlert } from '@/utility-methods/alert';
import { useSession } from 'next-auth/react';
import ClassUserAssignment from '@/components/ClassUserAssignment';
import { ClassTypes, UserSession } from '@/types';
import AssignStudentsToClass from '@/components/AssignStudentsToClass';

const Export = (props: any) => {
  const { status: sessionStatus, data: user_session } = useSession();
  const [search, setSearch] = useState<string>('');
  const [activeToolTip, setActiveToolTip] = useState<string>('');
  const [sessions, setSessions] = useState<ClassTypes[]>([]);
  const [filteredsessions, setFilteredsessions] = useState<any>(sessions);
  const [modal, setmodal] = useState(false);
  const [usermodal, setusermodal] = useState(false);
  const [assignStudent, setassignStudent] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>({});

  const queryClient = useQueryClient();

  const makeDuplicate = useMutation(
    (data: any) => createClass(data, user_session?.access_token),
    {
      onSuccess: async (data) => {
        if (!data.error) {
          showAlert('success', 'Class Created Successfuly');
          refetch();
        } else {
          showAlert('error', 'An error occured');
        }
      },
      onError: () => {
        showAlert('error', 'An Error Occured');
      },
    }
  );

  const duplicate = (x: any) => {
    const b: any = {};
    b.name = x.name + '_copy';
    b.description = x.description;
    b.class_index = x.class_index;
    b.school = user_session?.school.id;
    b.code = x.code + '_copy';

    makeDuplicate.mutate(b);
  };

  useEffect(() => {
    if (activeToolTip != '') {
      const x: any = sessions.find((t: any) => {
        return t.id == activeToolTip;
      });

      setSelectedSession(x);
    }
  }, [activeToolTip]);

  const {
    data: h,
    isSuccess,
    status,
    isLoading,
    refetch,
  } = useQuery('classes', () => getClasses(user_session?.access_token), {
    enabled: false,
  });

  useEffect(() => {
    setFilteredsessions(() => {
      return sessions?.filter((item: any) => {
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [search, sessions, status]);

  useEffect(() => {
    if (sessionStatus == 'authenticated') {
      refetch();
    }
  }, [sessionStatus, refetch]);
  useEffect(() => {
    if (isSuccess) {
      setSessions(h);
    }
  }, [h, isSuccess, status]);
  const displaySession: () => any = () => {
    if (sessions) {
      return filteredsessions?.map((data: any) => {
        return (
          <tr
            className={`${data.active ? `bg-primary-light` : ''} !important`}
            key={data.id}
          >
            <td>
              <div className='whitespace-nowrap'>
                <Link href={`/class/${data.id}`}>{data.name} </Link>
              </div>
            </td>
            <td>{data.class_index}</td>
            <td>{data.student_count ? data.student_count : 0}</td>
            <td>
              {data.class_teacher
                ? data.class_teacher.name
                : 'Teacher not Assigned '}
            </td>
            <td className='text-center '>
              <DropDownWIthChildren
                trigger={
                  <button
                    type='button'
                    className='relative'
                    onClick={() => {
                      setActiveToolTip(data.id);
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-6 w-6 '
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75'
                      />
                    </svg>
                  </button>
                }
              >
                <div className='absolute bottom-0 left-0 z-10 mt-8 w-[130px] translate-x-[-105%] translate-y-[100%] bg-[#f7f7f5] text-left shadow-md'>
                  <p
                    className='mb-2 cursor-pointer px-3 pt-2 hover:bg-white'
                    onClick={() => {
                      setmodal(true);
                    }}
                  >
                    Edit
                  </p>
                  <p
                    className='mb-2 cursor-pointer  px-2 hover:bg-white'
                    onClick={() => {
                      duplicate(data);
                    }}
                  >
                    Duplicate
                  </p>
                  <p
                    className='mb-2 cursor-pointer px-2  hover:bg-white'
                    onClick={() => {
                      setassignStudent(true);
                      setusermodal(true);
                    }}
                  >
                    Assign Students
                  </p>
                  <p
                    className='mb-2 cursor-pointer  px-2 hover:bg-white'
                    onClick={() => {
                      setassignStudent(false);
                      setusermodal(true);
                    }}
                  >
                    Assign Teacher
                  </p>
                  <DeleteClasses
                    sessionID={selectedSession.id}
                    user_session={user_session}
                    refreshClasses={refetch}
                  />
                </div>
              </DropDownWIthChildren>
            </td>
          </tr>
        );
      });
    } else if (isLoading) {
      return (
        <tr>
          <td> Loading Data...</td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td> No Class data to display</td>
        </tr>
      );
    }
  };
  return (
    <div className='grid-cols-6 gap-6 lg:grid'>
      <div className='panel col-span-2'>
        <div className='panel bg-[#f5f6f7]'>
          <h5 className='mb-5 text-lg font-semibold dark:text-white-light'>
            Create New Class
          </h5>
          <CreateClassForm
            create={true}
            user_session={user_session}
            sessionID={selectedSession.id}
            exit={setmodal}
            refreshClasses={refetch}
          />
        </div>
      </div>
      <div className='panel col-span-4 '>
        <div className=' justify-between md:flex '>
          <h5 className='mb-5 text-lg font-semibold dark:text-white-light'>
            Class List
          </h5>

          <form className=' mb-5 w-full sm:w-1/2'>
            <div className='relative'>
              <input
                type='text'
                value={search}
                placeholder='Search Classes...'
                className='form-input h-11 rounded-full bg-white shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] placeholder:tracking-wider ltr:pr-11 rtl:pl-11'
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type='button'
                className='btn btn-primary sessions-center absolute inset-y-0 m-auto flex h-9 w-9 justify-center rounded-full p-0 ltr:right-1 rtl:left-1'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
        <div
          className='table-responsive mb-5  pb-[120px] '
          onClick={(e: any) => {
            if (e.target.localName != 'svg' && e.target.localName != 'path') {
              setActiveToolTip('');
            }
          }}
        >
          <table className='table-striped'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Level</th>
                <th>No. of Students</th>
                <th>Teacher</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{displaySession()}</tbody>
          </table>
        </div>

        <div>
          <Transition appear show={usermodal} as={Fragment}>
            <Dialog
              as='div'
              open={usermodal}
              onClose={() => setusermodal(false)}
            >
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='fixed inset-0' />
              </Transition.Child>
              <div
                id='fadein_left_modal'
                className='fixed inset-0 z-[999] overflow-y-auto bg-[black]/60'
              >
                <div className='flex min-h-screen items-start justify-center px-4'>
                  <Dialog.Panel className='panel animate__animated animate__fadeInUp my-8 w-full max-w-3xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark'>
                    <div className='mx-auto w-4/5 py-5 text-center'>
                      <h5 className=' text-lg font-semibold dark:text-white-light'>
                        Assign{' '}
                        <span>{assignStudent ? 'Student' : 'Teacher'}</span> to
                        a class{' '}
                        <span className='text-sm'>{`(${selectedSession.name})`}</span>
                      </h5>
                      <AssignStudentsToClass
                        student={assignStudent}
                        user_session={user_session as UserSession}
                        classData={selectedSession}
                        refreshClasses={refetch}
                      />
                    </div>
                  </Dialog.Panel>
                </div>
              </div>
            </Dialog>
          </Transition>

          <Transition appear show={modal} as={Fragment}>
            <Dialog as='div' open={modal} onClose={() => setmodal(false)}>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='fixed inset-0' />
              </Transition.Child>
              <div
                id='fadein_left_modal'
                className='fixed inset-0 z-[999] overflow-y-auto bg-[black]/60'
              >
                <div className='flex min-h-screen items-start justify-center px-4'>
                  <Dialog.Panel className='panel animate__animated animate__fadeInUp my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark'>
                    <div className='mx-auto w-4/5 py-5'>
                      <h5 className=' text-lg font-semibold dark:text-white-light'>
                        Edit Class
                      </h5>
                      <p className='mb-5 text-sm text-primary'>
                        {selectedSession.name}
                      </p>

                      <EditClassForm
                        create={false}
                        user_session={user_session}
                        sessionData={selectedSession}
                        exit={setmodal}
                        refreshClasses={refetch}
                      />
                    </div>
                  </Dialog.Panel>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default Export;
