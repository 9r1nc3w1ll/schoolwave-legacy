import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSettings } from '@/hooks/useSchoolSettings';
import BasicSettings from './widgets/basic';
import SessionSettings from './widgets/session';
import EmailSettings from './widgets/email';
import { ISettings, ISettingsPayload, SettingsTabs } from '@/models/Settings';

const MySwal = withReactContent(Swal);

const SchoolSettings = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('School Settings'));
  });

  const {
    query,
    resetSettingsState,
    setActiveTab,
    setSettingsState,
    saveSettings,
    isSavingSettings,
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

  const settingsPayload: ISettingsPayload = useMemo(
    () => ({
      settings: {
        logo: {
          file: query?.logo?.file,
        },
        brand: {
          primary_color: query?.brand?.primaryColor,
          secondary_color: query?.brand?.secondaryColor,
        },
        school_id: query?.schoolId,
        school_name: query?.schoolName,
        school_radius: query?.schoolRadius,
        school_latitude: query?.schoolLatitude,
        storage_options: {
          token: query?.storageOptions?.token,
          driver: query?.storageOptions?.driver,
          default: query?.storageOptions?.default,
          base_path: query?.storageOptions?.basePath,
        },
        school_longitude: query?.schoolLongitude,
        staff_code_prefix: query?.staffCodePrefix,
        student_code_prefix: query?.studentCodePrefix,
      },
    }),
    [query]
  );

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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveSettings(settingsPayload);
              }}
            >
              {tabs[query?.activeTab].component}
              <button
                type='submit'
                className='btn btn-primary !mt-6'
                disabled={isSavingSettings}
              >
                {isSavingSettings ? 'Loading' : '   Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSettings;
