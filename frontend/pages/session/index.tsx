import Link from 'next/link';
import { useQuery } from 'react-query';
import {
  useEffect,
  useState,
  Fragment,
  useCallback,
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DeleteSessions from '@/components/DeleteSessions';
import CreateSessionForm from '@/components/CreateSessionForm';
import EditSessionForm from '@/components/EditSessionForm';
import { getSession } from '@/api-calls/session';
import { dateInPast } from '@/utility-methods/datey';
import { useSession } from 'next-auth/react';
import ActivateSessions from '@/components/ActivateSessions';

const Export = (props: any) => {
  const [search, setSearch] = useState<string>('');
  const [activeToolTip, setActiveToolTip] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [sessions, setSessions] = useState<[]>([]);
  const [filteredsessions, setFilteredsessions] = useState<any>(sessions);
  const [modal, setmodal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>();
  const { data: sessionData, status: sessionStatus } = useSession();

  useEffect(() => {
    if (activeToolTip != '') {
      const x = sessions.find((t: any) => {
        return t.id == activeToolTip;
      });

      if (x) {
        setSelectedSession(x);
      }
    }
  }, [activeToolTip]);

  const { data, isSuccess, status, isLoading, refetch } = useQuery(
    'session',
    () => getSession(sessionData?.access_token),
    { enabled: false }
  );

  useEffect(() => {
    if (sessionStatus == 'authenticated') {
      refetch();
    } else {
      console.log('Authentication faied');
    }
  }, [sessionStatus]);
  useEffect(() => {
    setFilteredsessions(() => {
      return sessions?.filter((item: any) => {
        return (
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.start_date.toLowerCase().includes(search.toLowerCase())
        );
      });
    });
  }, [search, sessions, status]);
  useEffect(() => {
    if (isSuccess) {
      setSessions(data.data);
    }
  }, [data, isSuccess, status]);
  const displaySession: () => any = () => {
    if (sessions?.length) {
      return filteredsessions?.map((item: any) => {
        return (
          <tr
            className={`${item.active ? `bg-primary-light` : ''} !important`}
            key={item.id}
          >
            <td>
              <div className='whitespace-nowrap'>
                <Link href={`/session/${item.id}`}>{item.name} </Link>
              </div>
            </td>
            <td>{item.start_date}</td>
            <td>{item.end_date}</td>
            <td>
              <input type='checkBox' checked={item.active} readOnly />
            </td>
            <td className='text-center '>
              <button
                type='button'
                className='relative'
                onClick={() => {
                  setActiveToolTip(item.id);
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
                {activeToolTip == item.id && selectedSession ? (
                  <div className='absolute bottom-0 left-0 z-10 mt-8 w-[110px] translate-x-[-105%] translate-y-[70%] bg-[#f7f7f5] text-left shadow-md'>
                    {!dateInPast(new Date(item.end_date), new Date()) &&
                    !item.active ? (
                      <>
                        <p
                          className='mb-2 px-3 pt-2 hover:bg-white'
                          onClick={() => {
                            setmodal(true);
                          }}
                        >
                          Edit
                        </p>
                        <ActivateSessions
                          sessionData={item}
                          user_session={sessionData}
                          refreshSession={refetch}
                        />
                        {/* props.sessionData.id, props.user_session.access_token */}
                        <DeleteSessions
                          sessionID={item.id}
                          user_session={sessionData}
                          refreshSession={refetch}
                        />
                      </>
                    ) : item.active ? (
                      <>
                        <p
                          className='mb-2 px-3 pt-2 hover:bg-white'
                          onClick={() => {
                            setmodal(true);
                          }}
                        >
                          Edit
                        </p>
                      </>
                    ) : (
                      <>
                        <p className='mb-2 px-2  hover:bg-white'>View Data</p>
                      </>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </button>
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
          <td> No Sessions data to display</td>
        </tr>
      );
    }
  };
  return (
    <div className='grid-cols-6 gap-6 lg:grid'>
      <div className='panel col-span-2'>
        <div className='panel bg-[#f5f6f7]'>
          <h5 className='mb-5 text-lg font-semibold dark:text-white-light'>
            Create New Session
          </h5>
          <CreateSessionForm
            user_session={sessionData}
            exit={setmodal}
            refreshList={refetch}
          />
        </div>
      </div>
      <div className='panel col-span-4 '>
        <div className=' justify-between md:flex '>
          <h5 className='mb-5 text-lg font-semibold dark:text-white-light'>
            Session List
          </h5>

          <form className=' mb-5 w-full sm:w-1/2'>
            <div className='relative'>
              <input
                type='text'
                value={search}
                placeholder='Search Sessions...'
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
          className='table-responsive mb-5  pb-[100px] '
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
                <th>Start Date</th>
                <th>End Date</th>
                <th>Current Session</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{displaySession()}</tbody>
          </table>
        </div>

        <div>
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
                        Edit Session
                      </h5>
                      <p className='mb-5 text-sm text-primary'>
                        {selectedSession ? selectedSession.name : ''}
                      </p>

                      <EditSessionForm
                        create={false}
                        user_session={sessionData}
                        sessionData={selectedSession}
                        exit={setmodal}
                        refreshSession={refetch}
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
