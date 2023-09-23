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

const SchoolSettings = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState('basic');
  const [SessionList, setSessionList] = useState<any>([]);

  // useEffect(() => {
  //   async function x() {
  //     let SessionDetails = await getSession(props.user_session?.access_token);
  //     if (SessionDetails.status == 'success') {
  //       let z: any = [];
  //       SessionDetails.data.forEach((session: any) => {
  //         z.push({ value: session.name, label: session.name });
  //       });
  //       setSessionList(z);
  //     }
  //   }
  //   x();
  // }, []);

  useEffect(() => {
    dispatch(setPageTitle('School Settings'));
  });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  const {
    _settingsConfig,
    query,
    resetSettingsState,
    setActiveTab,
    setSettingsState,
  } = useSettings();

  const tabs: SettingsTabs = {
    basic: {
      id: 'basic',
      title: 'Basic Details',
      component: (
        <BasicSettings
          query={query}
          resetSettingsState={resetSettingsState}
          setActiveTab={function (): void {
            throw new Error('Function not implemented.');
          }}
          setSettingsState={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      ),
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

  console.log({ query });

  return (
    <div>
      <div className='panel'>
        <h5 className='mb-5 text-lg font-semibold dark:text-white-light'>
          School Preference
        </h5>
        <div className='grid grid-cols-6 gap-5 '>
          <ul className='panel col-span-1'>
            {Object.values(tabs).map(
              (key: { id: string; title: string; component: JSX.Element }) => (
                <li
                  className={`mb-4 cursor-pointer ${
                    query?.activeTab == tabs[key?.id].id ? 'text-primary' : ''
                  }`}
                  onClick={() =>
                    setActiveTab(
                      tabs[key?.id].id as 'basic' | 'session' | 'email'
                    )
                  }
                >
                  {'>'} {key.title}
                </li>
              )
            )}
          </ul>
          <div className='col-span-5'>
            <form>{tabs[currentTab].component}</form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSettings;
