import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { getSession } from '@/apicalls/session';
import { forEach } from 'lodash';
import { getSchoolSettings } from '@/apicalls/settings';
import { useSession } from 'next-auth/react';
import { useSettings } from '@/hooks/useSchoolSettings';
import BasicSettings from './widgets/basic';
import SessionSettings from './widgets/session';
import EmailSettings from './widgets/email';
import { SettingsTabs } from '@/models/Settings';

const MySwal = withReactContent(Swal);

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  username: string;
}

interface FormResponse {
  ok: boolean;
  token: string;
}
const Step1 = (props: any) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState('basic');
  const [SessionList, setSessionList] = useState<any>([]);

  useEffect(() => {
    async function x() {
      let SessionDetails = await getSession(props.user_session?.access_token);
      if (SessionDetails.status == 'success') {
        let z: any = [];
        SessionDetails.data.forEach((session: any) => {
          z.push({ value: session.name, label: session.name });
        });
        setSessionList(z);
      }
    }
    x();
  }, []);

  useEffect(() => {
    dispatch(setPageTitle('Contact Form'));
  });
  const router = useRouter();
  const { mutateAsync, isLoading, error } = useMutation<
    Response,
    unknown,
    FormValues,
    unknown
  >(
    (post) =>
      fetch(
        `${process.env.NEXT_PUBLIC_NEXT_PUBLIC_BACKEND_URL}/api/auth/user_onboarding/`,
        {
          method: 'POST',
          body: JSON.stringify(post),
          headers: { 'Content-Type': 'application/json' },
        }
      ),
    {
      onSuccess: async (data) => {
        MySwal.fire({
          confirmButtonText: 'Next Step',
          html: (
            <div className='center mx-auto w-3/5'>
              {' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2.5}
                stroke='currentColor'
                className='mx-auto h-12 w-12 text-success'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p className='text-center text-success'>
                User Created successfully{' '}
              </p>
            </div>
          ),
        }).then(() => {
          router.push('/onboarding/step2');
        });
      },
      onError: (error) => {
        MySwal.fire({
          title: 'An Error Occured',
        });
      },
    }
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    data.username = data.email;
    const { token }: FormResponse = await (await mutateAsync(data)).json();
  };

  const { settingsConfig } = useSettings();

  const tabs: SettingsTabs = {
    basic: {
      id: 'basic',
      title: 'Basic Details',
      component: <BasicSettings />,
    },
    session: {
      id: 'session',
      title: 'Session Details',
      component: <SessionSettings />,
    },
    email: {
      id: 'email',
      title: 'Email Settings',
      component: <EmailSettings />,
    },
  };
  console.log(Object.values(tabs));
  return (
    <div>
      <div className='panel'>
        <h5 className='mb-5 text-lg font-semibold dark:text-white-light'>
          School Preference
        </h5>
        <div className='grid grid-cols-6 gap-5 '>
          <ul className='panel col-span-1'>
            {Object.values(tabs).map(
              (
                key: { id: string; title: string; component: JSX.Element },
                idx
              ) => (
                <li
                  className={`mb-4 cursor-pointer ${
                    currentTab == tabs[key?.id].id ? 'text-primary' : ''
                  }`}
                  onClick={() => setCurrentTab(tabs[key?.id].id)}
                >
                  {'>'} {key.title}
                </li>
              )
            )}
          </ul>
          <div className='col-span-5'>{tabs[currentTab].component}</div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
