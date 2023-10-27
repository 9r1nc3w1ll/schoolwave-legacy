import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { getSession, getSingleSession, getTerms } from '@/api-calls/session';
import { useSession } from 'next-auth/react';
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useState,
  Fragment,
  useEffect,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CreateTerm from '@/components/CreateTerm';

export default function Basic(props: any) {
  const { data: user_session, status: sessionStatus } = useSession();
  const [modal, setmodal] = useState(false);

  const router = useRouter();

  const { data: currentSession, refetch: refetchSession } = useQuery(
    'getSession',
    () => {
      return getSingleSession(
        router ? router.query?.id : '',
        user_session?.access_token
      );
    },
    {
      enabled: false,
    }
  );

  const {
    data: tableData,
    isSuccess,
    status,
    refetch,
  } = useQuery(
    'getTerms',
    () => {
      return getTerms(user_session?.access_token);
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (sessionStatus == 'authenticated') {
      refetch();
    }
    if (router.query.id) {
      refetchSession();
    }
  }, [sessionStatus, user_session, tableData, refetchSession, currentSession]);
  const tableElements = () => {
    return tableData?.map(
      (data: {
        active: any;
        id: Key | null | undefined;
        name:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | ReactFragment
          | ReactPortal
          | null
          | undefined;
        start_date:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | ReactFragment
          | ReactPortal
          | null
          | undefined;
        end_date:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | ReactFragment
          | ReactPortal
          | null
          | undefined;
      }) => {
        return (
          <tr
            className={`${data.active ? `bg-primary-light` : ''} !important`}
            key={data.id}
          >
            <td>
              <div className='whitespace-nowrap'>
                <Link href={`#`}>{data.name} </Link>
              </div>
            </td>
            <td>{data.start_date}</td>
            <td>{data.end_date}</td>
            <td className='flex gap-2 text-center'>
              {!data.active && (
                <button type='button' className='btn btn-success'>
                  Activate
                </button>
              )}

              <button type='button' className='btn btn-info'>
                Edit
              </button>
            </td>
          </tr>
        );
      }
    );
  };

  return (
    <div className='panel'>
      <h5 className='mb-5 text-lg font-semibold dark:text-white-light'>
        {currentSession?.name}
      </h5>
      <div className='table-responsive mb-5 '>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tableData?.length ? (
              tableElements()
            ) : (
              <tr>
                {' '}
                <td>
                  {' '}
                  No term data yet...{' '}
                  <span
                    className='cursor-pointer text-primary'
                    onClick={() => {
                      setmodal(true);
                    }}
                  >
                    Create Terms
                  </span>{' '}
                </td>{' '}
              </tr>
            )}
          </tbody>
        </table>

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
                <Dialog.Panel className='panel animate__animated animate__fadeInUp my-8 w-full max-w-3xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark'>
                  <div className='mx-auto w-4/5 py-5'>
                    <h5 className=' text-lg font-semibold dark:text-white-light'>
                      Update Term Details for the Session
                    </h5>

                    <CreateTerm
                      userSession={user_session}
                      selectedSession={router.query.id}
                      exit={setmodal}
                      refreshTerms={refetch}
                    />
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}
