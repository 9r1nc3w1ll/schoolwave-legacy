import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ShowTree from '../ShowTree';
import { Avatar } from '@mantine/core';
import { getInitials } from '@/utility_methods/helpers';

const SuperAdminSidebar = (props: any) => {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark
  );

  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add('active');
      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any =
          ul.closest('li.menu').querySelectorAll('.nav-link') || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [router.pathname]);

  const setActiveRoute = () => {
    let allLinks = document.querySelectorAll('.sidebar ul a.active');
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove('active');
    }
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    selector?.classList.add('active');
  };

  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${
          semidark ? 'text-white-dark' : ''
        }`}
      >
        <div className='h-full bg-white dark:bg-black'>
          <div className='flex items-center justify-between px-4 py-3'>
            <Link href='/' className='main-logo flex shrink-0 items-center'>
              <Avatar color='cyan' radius='xl'>
                {getInitials(
                  props?.user_session?.first_name,
                  props?.user_session?.last_name
                )}
              </Avatar>
            </Link>

            <button
              type='button'
              className='collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10'
              onClick={() => dispatch(toggleSidebar())}
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='m-auto h-5 w-5'
              >
                <path
                  d='M13 19L7 12L13 5'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  opacity='0.5'
                  d='M16.9998 19L10.9998 12L16.9998 5'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
          <PerfectScrollbar className='relative h-[calc(100vh-80px)]'>
            <ul className='relative space-y-0.5 p-4 py-0 font-semibold'>
              <ShowTree roles={['super_admin']}>
                <h2 className='-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]'>
                  <svg
                    className='hidden h-5 w-4 flex-none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <line x1='5' y1='12' x2='19' y2='12'></line>
                  </svg>
                  <span>{t('School Management')}</span>
                </h2>

                <li className='nav-item'>
                  <ul>
                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'Schools' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('Schools')}
                      >
                        <div className='flex items-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                          >
                            <path
                              d='M14.217 3.49965C12.796 2.83345 11.2035 2.83345 9.78252 3.49965L5.48919 5.51246C6.27114 5.59683 6.98602 6.0894 7.31789 6.86377C7.80739 8.00594 7.2783 9.32867 6.13613 9.81817L5.06046 10.2792C4.52594 10.5082 4.22261 10.6406 4.01782 10.7456C4.0167 10.7619 4.01564 10.7788 4.01465 10.7962L9.78261 13.5003C11.2036 14.1665 12.7961 14.1665 14.2171 13.5003L20.9082 10.3634C22.3637 9.68105 22.3637 7.31899 20.9082 6.63664L14.217 3.49965Z'
                              fill='#1C274D'
                            />
                            <path
                              d='M4.9998 12.9147V16.6254C4.9998 17.6334 5.50331 18.5772 6.38514 19.0656C7.85351 19.8787 10.2038 21 11.9998 21C13.7958 21 16.1461 19.8787 17.6145 19.0656C18.4963 18.5772 18.9998 17.6334 18.9998 16.6254V12.9148L14.8538 14.8585C13.0294 15.7138 10.9703 15.7138 9.14588 14.8585L4.9998 12.9147Z'
                              fill='#1C274D'
                            />
                            <path
                              d='M5.54544 8.43955C5.92616 8.27638 6.10253 7.83547 5.93936 7.45475C5.7762 7.07403 5.33529 6.89767 4.95456 7.06083L3.84318 7.53714C3.28571 7.77603 2.81328 7.97849 2.44254 8.18705C2.04805 8.40898 1.70851 8.66944 1.45419 9.05513C1.19986 9.44083 1.09421 9.85551 1.04563 10.3055C0.999964 10.7284 0.999981 11.2424 1 11.8489V14.7502C1 15.1644 1.33579 15.5002 1.75 15.5002C2.16422 15.5002 2.5 15.1644 2.5 14.7502V11.8878C2.5 11.232 2.50101 10.7995 2.53696 10.4665C2.57095 10.1517 2.63046 9.99612 2.70645 9.88087C2.78244 9.76562 2.90202 9.64964 3.178 9.49438C3.46985 9.33019 3.867 9.15889 4.46976 8.90056L5.54544 8.43955Z'
                              fill='#1C274D'
                            />
                          </svg>
                          <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                            {t('Schools')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'Schools'
                              ? '!rotate-90'
                              : 'rtl:rotate-180'
                          }
                        >
                          <svg
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M9 5L15 12L9 19'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </div>
                      </button>

                      <AnimateHeight
                        duration={300}
                        height={currentMenu === 'Schools' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/create_school'>
                              {t('Create Schools')}
                            </Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>
                  </ul>
                </li>
              </ShowTree>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default SuperAdminSidebar;
