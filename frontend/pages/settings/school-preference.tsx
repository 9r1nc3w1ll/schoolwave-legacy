import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react';
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
import { ISettings, SettingsTabs } from '@/models/Settings';

const MySwal = withReactContent(Swal);

const SchoolSettings = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('School Settings'));
  });
  const router = useRouter();

  const {
    _settingsConfig,
    query,
    resetSettingsState,
    setActiveTab,
    setSettingsState,
  } = useSettings();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettingsState({
      field: e.target.name as keyof ISettings,
      value: e.target.value,
    });
  };
  const tabs: SettingsTabs = {
    basic: {
      id: 'basic',
      title: 'Basic Details',
      component: (
        <BasicSettings
          query={query}
          resetSettingsState={resetSettingsState}
          handleChange={handleChange}
          setSettingsState={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      ),
    },
    session: {
      id: 'session',
      title: 'Session Details',
      component: (
        <SessionSettings
          query={query}
          resetSettingsState={resetSettingsState}
          handleChange={handleChange}
        />
      ),
    },
    email: {
      id: 'email',
      title: 'Email Settings',
      component: <EmailSettings />,
    },
  };

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
                  key={key?.id}
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
            <form>
              {tabs[query?.activeTab].component}
              <button type='submit' className='btn btn-primary !mt-6'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSettings;
