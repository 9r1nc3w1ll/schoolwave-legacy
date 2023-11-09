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
import { getInitials } from '@/utility-methods/helpers';

const Sidebar = (props: any) => {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const [errorSubMenu, setErrorSubMenu] = useState(false);
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
                            <Link href='/create-school'>
                              {t('Create Schools')}
                            </Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>
                  </ul>
                </li>
              </ShowTree>
              <ShowTree roles={['admin', 'student']}>
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
                  <span>{t('Academics')}</span>
                </h2>

                <li className='nav-item'>
                  <ul>
                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'Admissions' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('Admissions')}
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
                            {t('Admissions')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'Admissions'
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
                        height={currentMenu === 'Admissions' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/admissions'>
                              {t('Admission List')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/admissions#create-admission'>
                              {t('Create Admission')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/admissions#create-bulk-upload'>
                              {t('Bulk Upload')}
                            </Link>
                          </li>
                          <li>
                            <Link href='#'>{t('E-Admission')}</Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>

                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'Classes' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('Classes')}
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
                              fill-rule='evenodd'
                              clip-rule='evenodd'
                              d='M3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447ZM10.5431 7.51724C10.8288 7.2173 10.8172 6.74256 10.5172 6.4569C10.2173 6.17123 9.74256 6.18281 9.4569 6.48276L7.14286 8.9125L6.5431 8.28276C6.25744 7.98281 5.78271 7.97123 5.48276 8.2569C5.18281 8.54256 5.17123 9.01729 5.4569 9.31724L6.59976 10.5172C6.74131 10.6659 6.9376 10.75 7.14286 10.75C7.34812 10.75 7.5444 10.6659 7.68596 10.5172L10.5431 7.51724ZM13 8.25C12.5858 8.25 12.25 8.58579 12.25 9C12.25 9.41422 12.5858 9.75 13 9.75H18C18.4142 9.75 18.75 9.41422 18.75 9C18.75 8.58579 18.4142 8.25 18 8.25H13ZM10.5431 14.5172C10.8288 14.2173 10.8172 13.7426 10.5172 13.4569C10.2173 13.1712 9.74256 13.1828 9.4569 13.4828L7.14286 15.9125L6.5431 15.2828C6.25744 14.9828 5.78271 14.9712 5.48276 15.2569C5.18281 15.5426 5.17123 16.0173 5.4569 16.3172L6.59976 17.5172C6.74131 17.6659 6.9376 17.75 7.14286 17.75C7.34812 17.75 7.5444 17.6659 7.68596 17.5172L10.5431 14.5172ZM13 15.25C12.5858 15.25 12.25 15.5858 12.25 16C12.25 16.4142 12.5858 16.75 13 16.75H18C18.4142 16.75 18.75 16.4142 18.75 16C18.75 15.5858 18.4142 15.25 18 15.25H13Z'
                              fill='#1C274C'
                            />
                          </svg>
                          <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                            {t('Classes')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'Classes'
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
                        height={currentMenu === 'Classes' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/class'>{t('Class Lists')}</Link>
                          </li>
                          <li>
                            <Link href='/class/schedule'>
                              {t('Class Schedule')}
                            </Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>

                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'Subjects' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('Subjects')}
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
                              d='M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18V13.974C4.50221 14.5906 5.21495 15.1029 6.00774 15.4992C7.58004 16.2854 9.69967 16.75 12 16.75C14.3003 16.75 16.42 16.2854 17.9923 15.4992C18.7851 15.1029 19.4978 14.5906 20 13.974V18Z'
                              fill='#1C274C'
                            />
                            <path
                              d='M12 10.75C14.3003 10.75 16.42 10.2854 17.9923 9.49925C18.7851 9.10285 19.4978 8.59059 20 7.97397V12C20 12.5 18.2143 13.5911 17.3214 14.1576C15.9983 14.8192 14.118 15.25 12 15.25C9.88205 15.25 8.00168 14.8192 6.67856 14.1576C5.5 13.5683 4 12.5 4 12V7.97397C4.50221 8.59059 5.21495 9.10285 6.00774 9.49925C7.58004 10.2854 9.69967 10.75 12 10.75Z'
                              fill='#1C274C'
                            />
                            <path
                              d='M17.3214 8.15761C15.9983 8.81917 14.118 9.25 12 9.25C9.88205 9.25 8.00168 8.81917 6.67856 8.15761C6.16384 7.95596 5.00637 7.31492 4.2015 6.27935C4.06454 6.10313 4.00576 5.87853 4.03988 5.65798C4.06283 5.50969 4.0948 5.35695 4.13578 5.26226C4.82815 3.40554 8.0858 2 12 2C15.9142 2 19.1718 3.40554 19.8642 5.26226C19.9052 5.35695 19.9372 5.50969 19.9601 5.65798C19.9942 5.87853 19.9355 6.10313 19.7985 6.27935C18.9936 7.31492 17.8362 7.95596 17.3214 8.15761Z'
                              fill='#1C274C'
                            />
                          </svg>
                          <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                            {t('Subjects')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'Subjects'
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
                        height={currentMenu === 'Subjects' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/subjects'>{t('Subject Lists')}</Link>
                          </li>
                          <li>
                            <Link href='/subjects/lesson_note'>
                              {t('Lesson Notes')}
                            </Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>

                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'Sessions' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('Sessions')}
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
                              d='M18.1111 10.1629C17.6067 10.5 16.9045 10.5 15.5 10.5H12.75V12.5H15.296C15.9536 12.5 16.2823 12.5 16.5841 12.5982C16.7172 12.6415 16.8454 12.6987 16.9665 12.7688C17.2412 12.9277 17.4608 13.1723 17.9002 13.6616C18.7509 14.6089 19.1762 15.0826 19.2786 15.6362C19.3231 15.8767 19.3231 16.1233 19.2786 16.3638C19.1762 16.9174 18.7509 17.3911 17.9002 18.3384C17.4608 18.8277 17.2412 19.0723 16.9665 19.2312C16.8454 19.3013 16.7172 19.3585 16.5841 19.4018C16.2823 19.5 15.9536 19.5 15.296 19.5H12.75V21.25H14C14.4142 21.25 14.75 21.5858 14.75 22C14.75 22.4142 14.4142 22.75 14 22.75H9.99999C9.58578 22.75 9.24999 22.4142 9.24999 22C9.24999 21.5858 9.58578 21.25 9.99999 21.25H11.25V19.5H8.49999C7.09553 19.5 6.3933 19.5 5.88885 19.1629C5.67047 19.017 5.48297 18.8295 5.33705 18.6111C4.99999 18.1067 4.99999 17.4045 4.99999 16C4.99999 14.5955 4.99999 13.8933 5.33705 13.3889C5.48297 13.1705 5.67047 12.983 5.88885 12.8371C6.3933 12.5 7.09553 12.5 8.49999 12.5H11.25V10.5H8.70399C8.04642 10.5 7.71764 10.5 7.41593 10.4018C7.28282 10.3585 7.15463 10.3013 7.03346 10.2312C6.75882 10.0723 6.53915 9.8277 6.09981 9.33844C5.24911 8.39107 4.82376 7.91738 4.72136 7.36381C4.67687 7.12331 4.67687 6.87669 4.72136 6.63619C4.82376 6.08262 5.24911 5.60894 6.09981 4.66156L6.09981 4.66156C6.53915 4.1723 6.75882 3.92767 7.03346 3.76879C7.15463 3.6987 7.28282 3.64152 7.41593 3.5982C7.71764 3.5 8.04642 3.5 8.70399 3.5H11.25V2C11.25 1.58579 11.5858 1.25 12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3.5H15.5C16.9045 3.5 17.6067 3.5 18.1111 3.83706C18.3295 3.98298 18.517 4.17048 18.6629 4.38886C19 4.89331 19 5.59554 19 7C19 8.40446 19 9.10669 18.6629 9.61114C18.517 9.82952 18.3295 10.017 18.1111 10.1629Z'
                              fill='#1C274C'
                            />
                          </svg>
                          <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                            {t('Sessions')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'Sessions'
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
                        height={currentMenu === 'Sessions' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/session'>{t('Sessions List')}</Link>
                          </li>

                          <li>
                            <Link href='/session/calendar_view'>
                              {t('Calender View')}
                            </Link>
                          </li>

                          <li>
                            <Link href='/session/event'>{t('Events')}</Link>
                          </li>

                          <li>
                            <Link href='#'>{t('Promotions')}</Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>

                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'Examination' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('Examination')}
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
                              fill-rule='evenodd'
                              clip-rule='evenodd'
                              d='M2 16.1436V4.9978C2 3.89963 2.8863 3.00752 3.9824 3.07489C4.95877 3.1349 6.11349 3.25351 7 3.48744C8.04921 3.76431 9.29611 4.35401 10.2823 4.87546C10.5894 5.03785 10.9159 5.15048 11.2502 5.21397V20.3926C10.9472 20.3258 10.6516 20.218 10.3724 20.0692C9.37293 19.5365 8.08145 18.9187 7 18.6334C6.12329 18.402 4.98428 18.2835 4.01486 18.2228C2.90605 18.1535 2 17.2546 2 16.1436ZM5.18208 8.27239C4.78023 8.17193 4.37303 8.41625 4.27257 8.8181C4.17211 9.21994 4.41643 9.62715 4.81828 9.72761L8.81828 10.7276C9.22012 10.8281 9.62732 10.5837 9.72778 10.1819C9.82825 9.78006 9.58393 9.37285 9.18208 9.27239L5.18208 8.27239ZM5.18208 12.2724C4.78023 12.1719 4.37303 12.4163 4.27257 12.8181C4.17211 13.2199 4.41643 13.6271 4.81828 13.7276L8.81828 14.7276C9.22012 14.8281 9.62732 14.5837 9.72778 14.1819C9.82825 13.7801 9.58393 13.3729 9.18208 13.2724L5.18208 12.2724Z'
                              fill='#1C274D'
                            />
                            <path
                              fill-rule='evenodd'
                              clip-rule='evenodd'
                              d='M12.7502 20.3925C13.0531 20.3257 13.3485 20.218 13.6276 20.0692C14.6271 19.5365 15.9185 18.9187 17 18.6334C17.8767 18.402 19.0157 18.2835 19.9851 18.2228C21.094 18.1535 22 17.2546 22 16.1436V4.93319C22 3.86075 21.1538 2.98041 20.082 3.01775C18.9534 3.05706 17.5469 3.17403 16.5 3.48744C15.5924 3.75916 14.5353 4.30418 13.6738 4.80275C13.3824 4.97142 13.0709 5.0953 12.7502 5.17387V20.3925ZM19.1821 9.72761C19.5839 9.62715 19.8282 9.21994 19.7278 8.8181C19.6273 8.41625 19.2201 8.17193 18.8183 8.27239L14.8183 9.27239C14.4164 9.37285 14.1721 9.78006 14.2726 10.1819C14.373 10.5837 14.7802 10.8281 15.1821 10.7276L19.1821 9.72761ZM19.1821 13.7276C19.5839 13.6271 19.8282 13.2199 19.7278 12.8181C19.6273 12.4163 19.2201 12.1719 18.8183 12.2724L14.8183 13.2724C14.4164 13.3729 14.1721 13.7801 14.2726 14.1819C14.373 14.5837 14.7802 14.8281 15.1821 14.7276L19.1821 13.7276Z'
                              fill='#1C274D'
                            />
                          </svg>
                          <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                            {t('Examination/Assessments')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'Sessions'
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
                        height={currentMenu === 'Examination' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/exams'>{t('Examination ')}</Link>
                          </li>
                          <li>
                            <Link href='/apps/invoice/preview'>
                              {t('Assessment ')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/exams/exams-questions'>
                              {t('Questions')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/apps/invoice/preview'>
                              {t('Results')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/apps/invoice/preview'>
                              {t('Scan to Mark')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/apps/invoice/preview'>
                              {t('Promotions')}
                            </Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>
                  </ul>
                </li>
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
                  <span>{t('People')}</span>
                </h2>

                <li className='nav-item'>
                  <ul>
                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'Students' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('Students')}
                      >
                        <div className='flex items-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='18'
                            height='21'
                            viewBox='0 0 18 21'
                            fill='none'
                          >
                            <path
                              d='M9 8C11.2091 8 13 6.20914 13 4C13 1.79086 11.2091 0 9 0C6.79086 0 5 1.79086 5 4C5 6.20914 6.79086 8 9 8Z'
                              fill='#1C274C'
                            />
                            <path
                              d='M5.00007 10.25C2.90904 10.25 1.149 11.8151 0.904685 13.8918L0.255209 19.4124C0.206812 19.8237 0.501065 20.1965 0.912441 20.2449C1.32382 20.2933 1.69654 19.999 1.74494 19.5876L2.39441 14.0671C2.51949 13.0039 3.26894 12.1515 4.25007 11.859L4.25007 16.052C4.25004 16.9505 4.25002 17.6997 4.32998 18.2945C4.41439 18.9223 4.60006 19.4891 5.05553 19.9445C5.511 20.4 6.0778 20.5857 6.70559 20.6701C7.30037 20.7501 8.04958 20.75 8.94805 20.75H9.05207C9.95053 20.75 10.6998 20.7501 11.2946 20.6701C11.9223 20.5857 12.4891 20.4 12.9446 19.9445C13.4001 19.4891 13.5858 18.9223 13.6702 18.2945C13.7501 17.6997 13.7501 16.9505 13.7501 16.052L13.7501 11.859C14.7312 12.1515 15.4807 13.0039 15.6057 14.0671L16.2552 19.5876C16.3036 19.999 16.6763 20.2933 17.0877 20.2449C17.4991 20.1965 17.7933 19.8237 17.7449 19.4124L17.0955 13.8918C16.8511 11.8151 15.0911 10.25 13.0001 10.25H5.00007Z'
                              fill='#1C274C'
                            />
                          </svg>
                          <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                            {t('Students')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'Students'
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
                        height={currentMenu === 'Students' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/students'>{t('Students List')}</Link>
                          </li>
                          <li>
                            <Link href='/attendance'>
                              {t('Student Attendance')}
                            </Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>

                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'Parents' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('Parents')}
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
                              d='M12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10Z'
                              fill='#1C274C'
                            />
                            <path
                              d='M2.72778 5.81803C2.62732 5.41619 2.22012 5.17186 1.81828 5.27233C1.41643 5.37279 1.17211 5.77999 1.27257 6.18184L1.65454 7.7097C2.3593 10.5287 4.49604 12.7495 7.25018 13.5787L7.25018 18.0519C7.25015 18.9504 7.25012 19.6996 7.33009 20.2944C7.41449 20.9222 7.60016 21.489 8.05563 21.9445C8.5111 22.3999 9.0779 22.5856 9.7057 22.67C10.3005 22.75 11.0497 22.75 11.9482 22.7499H12.0522C12.9507 22.75 13.6999 22.75 14.2947 22.67C14.9225 22.5856 15.4892 22.3999 15.9447 21.9445C16.4002 21.489 16.5859 20.9222 16.6703 20.2944C16.7502 19.6996 16.7502 18.9504 16.7502 18.052L16.7502 13.859C17.7313 14.1514 18.4808 15.0039 18.6058 16.067L19.2553 21.5876C19.3037 21.9989 19.6764 22.2932 20.0878 22.2448C20.4992 22.1964 20.7934 21.8237 20.745 21.4123L20.0956 15.8918C19.8512 13.815 18.0912 12.2499 16.0002 12.2499H8.0847C5.64125 11.6764 3.71957 9.78517 3.10975 7.3459L2.72778 5.81803Z'
                              fill='#1C274C'
                            />
                          </svg>
                          <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                            {t('Parents')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'Parents'
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
                        height={currentMenu === 'Parents' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/parents'>{t('Parents')}</Link>
                          </li>
                          <li>
                            <Link href='/parents#create_new'>
                              {t('Create Parent')}
                            </Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>

                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'Employees' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('Employees')}
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
                              d='M15.5 7.5C15.5 9.433 13.933 11 12 11C10.067 11 8.5 9.433 8.5 7.5C8.5 5.567 10.067 4 12 4C13.933 4 15.5 5.567 15.5 7.5Z'
                              fill='#1C274C'
                            />
                            <path
                              d='M18 16.5C18 18.433 15.3137 20 12 20C8.68629 20 6 18.433 6 16.5C6 14.567 8.68629 13 12 13C15.3137 13 18 14.567 18 16.5Z'
                              fill='#1C274C'
                            />
                            <path
                              d='M7.12205 5C7.29951 5 7.47276 5.01741 7.64005 5.05056C7.23249 5.77446 7 6.61008 7 7.5C7 8.36825 7.22131 9.18482 7.61059 9.89636C7.45245 9.92583 7.28912 9.94126 7.12205 9.94126C5.70763 9.94126 4.56102 8.83512 4.56102 7.47063C4.56102 6.10614 5.70763 5 7.12205 5Z'
                              fill='#1C274C'
                            />
                            <path
                              d='M5.44734 18.986C4.87942 18.3071 4.5 17.474 4.5 16.5C4.5 15.5558 4.85657 14.744 5.39578 14.0767C3.4911 14.2245 2 15.2662 2 16.5294C2 17.8044 3.5173 18.8538 5.44734 18.986Z'
                              fill='#1C274C'
                            />
                            <path
                              d='M16.9999 7.5C16.9999 8.36825 16.7786 9.18482 16.3893 9.89636C16.5475 9.92583 16.7108 9.94126 16.8779 9.94126C18.2923 9.94126 19.4389 8.83512 19.4389 7.47063C19.4389 6.10614 18.2923 5 16.8779 5C16.7004 5 16.5272 5.01741 16.3599 5.05056C16.7674 5.77446 16.9999 6.61008 16.9999 7.5Z'
                              fill='#1C274C'
                            />
                            <path
                              d='M18.5526 18.986C20.4826 18.8538 21.9999 17.8044 21.9999 16.5294C21.9999 15.2662 20.5088 14.2245 18.6041 14.0767C19.1433 14.744 19.4999 15.5558 19.4999 16.5C19.4999 17.474 19.1205 18.3071 18.5526 18.986Z'
                              fill='#1C274C'
                            />
                          </svg>
                          <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                            {t('Employees')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'Employees'
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
                        height={currentMenu === 'Employees' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/employees'>{t('Employee List')}</Link>
                          </li>
                          <li>
                            <Link href='/employees#create_new'>
                              {t('Create Employee')}
                            </Link>
                          </li>
                          <li>
                            <Link href='#'>{t('Payrol Management')}</Link>
                          </li>
                          <li>
                            <Link href='#'>{t('Leave Management')}</Link>
                          </li>
                          <li>
                            <Link href='#'>{t('ID Cards')}</Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>

                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'Visitors' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('Visitors')}
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
                              fill-rule='evenodd'
                              clip-rule='evenodd'
                              d='M10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4ZM13.25 9C13.25 8.58579 13.5858 8.25 14 8.25H19C19.4142 8.25 19.75 8.58579 19.75 9C19.75 9.41421 19.4142 9.75 19 9.75H14C13.5858 9.75 13.25 9.41421 13.25 9ZM14.25 12C14.25 11.5858 14.5858 11.25 15 11.25H19C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75H15C14.5858 12.75 14.25 12.4142 14.25 12ZM15.25 15C15.25 14.5858 15.5858 14.25 16 14.25H19C19.4142 14.25 19.75 14.5858 19.75 15C19.75 15.4142 19.4142 15.75 19 15.75H16C15.5858 15.75 15.25 15.4142 15.25 15ZM11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9ZM9 17C13 17 13 16.1046 13 15C13 13.8954 11.2091 13 9 13C6.79086 13 5 13.8954 5 15C5 16.1046 5 17 9 17Z'
                              fill='#1C274C'
                            />
                          </svg>
                          <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                            {t('Visitors')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'Visitors'
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
                        height={currentMenu === 'Visitors' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/apps/invoice/list'>
                              {t('Visitors Logs')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/apps/invoice/preview'>
                              {t('Access Management')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/apps/invoice/preview'>
                              {t('Inquiries')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/apps/invoice/preview'>
                              {t('Complaints')}
                            </Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>
                  </ul>
                </li>

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
                  <span>{t('Finance')}</span>
                </h2>

                <li className='nav-item'>
                  <ul>
                    <li className='menu nav-item'>
                      <button
                        type='button'
                        className={`${
                          currentMenu === 'School Fees' ? 'active' : ''
                        } nav-link group w-full`}
                        onClick={() => toggleMenu('School Fees')}
                      >
                        <div className='flex items-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                          >
                            <path
                              d='M9.25 5.84748C8.3141 6.10339 7.75 6.82154 7.75 7.5C7.75 8.17846 8.3141 8.89661 9.25 9.15252V5.84748Z'
                              fill='#1C274C'
                            />
                            <path
                              d='M10.75 10.8475V14.1525C11.6859 13.8966 12.25 13.1785 12.25 12.5C12.25 11.8215 11.6859 11.1034 10.75 10.8475Z'
                              fill='#1C274C'
                            />
                            <path
                              fill-rule='evenodd'
                              clip-rule='evenodd'
                              d='M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM10 3.25C10.4142 3.25 10.75 3.58579 10.75 4V4.31673C12.3804 4.60867 13.75 5.83361 13.75 7.5C13.75 7.91421 13.4142 8.25 13 8.25C12.5858 8.25 12.25 7.91421 12.25 7.5C12.25 6.82154 11.6859 6.10339 10.75 5.84748V9.31673C12.3804 9.60867 13.75 10.8336 13.75 12.5C13.75 14.1664 12.3804 15.3913 10.75 15.6833V16C10.75 16.4142 10.4142 16.75 10 16.75C9.58579 16.75 9.25 16.4142 9.25 16V15.6833C7.61957 15.3913 6.25 14.1664 6.25 12.5C6.25 12.0858 6.58579 11.75 7 11.75C7.41421 11.75 7.75 12.0858 7.75 12.5C7.75 13.1785 8.3141 13.8966 9.25 14.1525V10.6833C7.61957 10.3913 6.25 9.16639 6.25 7.5C6.25 5.83361 7.61957 4.60867 9.25 4.31673V4C9.25 3.58579 9.58579 3.25 10 3.25Z'
                              fill='#1C274C'
                            />
                          </svg>
                          <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                            {t('School Fees')}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu === 'School Fees'
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
                        height={currentMenu === 'School Fees' ? 'auto' : 0}
                      >
                        <ul className='sub-menu text-gray-500'>
                          <li>
                            <Link href='/school-fees/fee-items'>
                              {t('Fee Items')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/school-fees/fee-templates'>
                              {t('Fee Templates')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/school-fees/invoices'>
                              {t('Invoices')}
                            </Link>
                          </li>
                          <li>
                            <Link href='/school-fees/discounts'>
                              {t('Discounts')}
                            </Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>
                  </ul>
                </li>

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
                  <span>{t('Communications')}</span>
                </h2>

                <li className='menu nav-item'>
                  <button
                    type='button'
                    className={`${
                      currentMenu === 'Messages' ? 'active' : ''
                    } nav-link group w-full`}
                    onClick={() => toggleMenu('Messages')}
                  >
                    <div className='flex items-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                      >
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M11.0867 19.3877L11.6288 18.4718C12.0492 17.7614 12.2595 17.4062 12.5972 17.2098C12.9349 17.0134 13.36 17.0061 14.2104 16.9915C15.4658 16.9698 16.2531 16.8929 16.9134 16.6194C18.1386 16.1119 19.1119 15.1386 19.6194 13.9134C20 12.9946 20 11.8297 20 9.5V8.5C20 5.22657 20 3.58985 19.2632 2.38751C18.8509 1.71473 18.2853 1.14908 17.6125 0.736799C16.4101 0 14.7734 0 11.5 0H8.5C5.22657 0 3.58985 0 2.38751 0.736799C1.71473 1.14908 1.14908 1.71473 0.736799 2.38751C0 3.58985 0 5.22657 0 8.5V9.5C0 11.8297 0 12.9946 0.380602 13.9134C0.888072 15.1386 1.86144 16.1119 3.08658 16.6194C3.74689 16.8929 4.53422 16.9698 5.78958 16.9915C6.63992 17.0061 7.06509 17.0134 7.40279 17.2098C7.74049 17.4063 7.95073 17.7614 8.37121 18.4718L8.91331 19.3877C9.39647 20.204 10.6035 20.204 11.0867 19.3877ZM14 10C14.5523 10 15 9.55229 15 9C15 8.44771 14.5523 8 14 8C13.4477 8 13 8.44771 13 9C13 9.55229 13.4477 10 14 10ZM11 9C11 9.55229 10.5523 10 10 10C9.44771 10 9 9.55229 9 9C9 8.44771 9.44771 8 10 8C10.5523 8 11 8.44771 11 9ZM6 10C6.55228 10 7 9.55229 7 9C7 8.44771 6.55228 8 6 8C5.44772 8 5 8.44771 5 9C5 9.55229 5.44772 10 6 10Z'
                          fill='#1C274C'
                        />
                      </svg>
                      <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                        {t('Messages')}
                      </span>
                    </div>

                    <div
                      className={
                        currentMenu === 'Messages'
                          ? 'rotate-90'
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
                    height={currentMenu === 'Messages' ? 'auto' : 0}
                  >
                    <ul className='sub-menu text-gray-500'>
                      <li>
                        <Link href='/datatables/basic'>
                          {t('Message Board')}
                        </Link>
                      </li>
                      <li>
                        <Link href='/datatables/advanced'>{t('Sms')}</Link>
                      </li>
                      <li>
                        <Link href='/datatables/skin'>{t('Mails')}</Link>
                      </li>
                    </ul>
                  </AnimateHeight>
                </li>

                <li className='menu nav-item'>
                  <button
                    type='button'
                    className={`${
                      currentMenu === 'datalabel' ? 'active' : ''
                    } nav-link group w-full`}
                    onClick={() => toggleMenu('datalabel')}
                  >
                    <div className='flex items-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='17'
                        viewBox='0 0 20 17'
                        fill='none'
                      >
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M19.3911 13.3358C19.4356 13.3818 19.4579 13.4048 19.4787 13.4276C19.7998 13.7802 19.9843 14.2358 19.999 14.7124C20 14.7433 20 14.7753 20 14.8393C20 14.9885 20 15.0631 19.996 15.1261C19.9325 16.1314 19.1314 16.9325 18.1261 16.996C18.0631 17 17.9885 17 17.8393 17H2.16068C2.01148 17 1.93688 17 1.87388 16.996C0.868647 16.9325 0.067495 16.1314 0.00398028 15.1261C0 15.0631 0 14.9885 0 14.8393C0 14.7753 0 14.7433 0.000955638 14.7124C0.0156941 14.2358 0.200222 13.7802 0.521267 13.4276C0.542076 13.4048 0.564332 13.3818 0.608828 13.3359L1.90311 12H18.0969L19.3911 13.3358ZM6.75 15C6.75 14.5858 7.08579 14.25 7.5 14.25H12.5C12.9142 14.25 13.25 14.5858 13.25 15C13.25 15.4142 12.9142 15.75 12.5 15.75H7.5C7.08579 15.75 6.75 15.4142 6.75 15Z'
                          fill='#1C274C'
                        />
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M2.35294 4C2.35294 2.11438 2.35294 1.17157 2.93873 0.585786C3.52451 0 4.46732 0 6.35294 0H13.6471C15.5327 0 16.4755 0 17.0613 0.585786C17.6471 1.17157 17.6471 2.11438 17.6471 4V11H2.35294V4ZM10 3.5C10.4142 3.5 10.75 3.16421 10.75 2.75C10.75 2.33579 10.4142 2 10 2C9.58579 2 9.25 2.33579 9.25 2.75C9.25 3.16421 9.58579 3.5 10 3.5Z'
                          fill='#1C274C'
                        />
                      </svg>
                      <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                        {t('School Website')}
                      </span>
                    </div>

                    <div
                      className={
                        currentMenu === 'datalabel'
                          ? 'rotate-90'
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
                    height={currentMenu === 'datalabel' ? 'auto' : 0}
                  >
                    <ul className='sub-menu text-gray-500'>
                      <li>
                        <Link href='/datatables/basic'>{t('Pages')}</Link>
                      </li>
                      <li>
                        <Link href='/datatables/advanced'>{t('Menu')}</Link>
                      </li>
                      <li>
                        <Link href='/datatables/skin'>{t('Pop-Ups')}</Link>
                      </li>
                      <li>
                        <Link href='/datatables/order-sorting'>
                          {t('Blogs')}
                        </Link>
                      </li>
                    </ul>
                  </AnimateHeight>
                </li>

                <li className='menu nav-item'>
                  <button
                    type='button'
                    className={`${
                      currentMenu === 'forms' ? 'active' : ''
                    } nav-link group w-full`}
                    onClick={() => toggleMenu('forms')}
                  >
                    <div className='flex items-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='18'
                        height='20'
                        viewBox='0 0 18 20'
                        fill='none'
                      >
                        <path
                          d='M6.5 0C5.67157 0 5 0.671573 5 1.5V2.5C5 3.32843 5.67157 4 6.5 4H11.5C12.3284 4 13 3.32843 13 2.5V1.5C13 0.671573 12.3284 0 11.5 0H6.5Z'
                          fill='#1C274C'
                        />
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M3.5 2.03662C2.24209 2.10719 1.44798 2.30764 0.87868 2.87694C0 3.75562 0 5.16983 0 7.99826V13.9983C0 16.8267 0 18.2409 0.87868 19.1196C1.75736 19.9983 3.17157 19.9983 6 19.9983H12C14.8284 19.9983 16.2426 19.9983 17.1213 19.1196C18 18.2409 18 16.8267 18 13.9983V7.99826C18 5.16983 18 3.75562 17.1213 2.87694C16.552 2.30764 15.7579 2.10719 14.5 2.03662V2.5C14.5 4.15685 13.1569 5.5 11.5 5.5H6.5C4.84315 5.5 3.5 4.15685 3.5 2.5V2.03662ZM4 7.75C3.58579 7.75 3.25 8.08579 3.25 8.5C3.25 8.91421 3.58579 9.25 4 9.25H4.5C4.91421 9.25 5.25 8.91421 5.25 8.5C5.25 8.08579 4.91421 7.75 4.5 7.75H4ZM7.5 7.75C7.08579 7.75 6.75 8.08579 6.75 8.5C6.75 8.91421 7.08579 9.25 7.5 9.25H14C14.4142 9.25 14.75 8.91421 14.75 8.5C14.75 8.08579 14.4142 7.75 14 7.75H7.5ZM4 11.25C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H4.5C4.91421 12.75 5.25 12.4142 5.25 12C5.25 11.5858 4.91421 11.25 4.5 11.25H4ZM7.5 11.25C7.08579 11.25 6.75 11.5858 6.75 12C6.75 12.4142 7.08579 12.75 7.5 12.75H14C14.4142 12.75 14.75 12.4142 14.75 12C14.75 11.5858 14.4142 11.25 14 11.25H7.5ZM4 14.75C3.58579 14.75 3.25 15.0858 3.25 15.5C3.25 15.9142 3.58579 16.25 4 16.25H4.5C4.91421 16.25 5.25 15.9142 5.25 15.5C5.25 15.0858 4.91421 14.75 4.5 14.75H4ZM7.5 14.75C7.08579 14.75 6.75 15.0858 6.75 15.5C6.75 15.9142 7.08579 16.25 7.5 16.25H14C14.4142 16.25 14.75 15.9142 14.75 15.5C14.75 15.0858 14.4142 14.75 14 14.75H7.5Z'
                          fill='#1C274C'
                        />
                      </svg>
                      <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                        {t('forms')}
                      </span>
                    </div>

                    <div
                      className={
                        currentMenu === 'forms' ? 'rotate-90' : 'rtl:rotate-180'
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
                    height={currentMenu === 'forms' ? 'auto' : 0}
                  >
                    <ul className='sub-menu text-gray-500'>
                      <li>
                        <Link href='/forms/basic'>{t('basic')}</Link>
                      </li>
                      <li>
                        <Link href='/forms/input-group'>
                          {t('input_group')}
                        </Link>
                      </li>
                      <li>
                        <Link href='/forms/layouts'>{t('layouts')}</Link>
                      </li>
                      <li>
                        <Link href='/forms/validation'>{t('validation')}</Link>
                      </li>
                      <li>
                        <Link href='/forms/input-mask'>{t('input_mask')}</Link>
                      </li>
                      <li>
                        <Link href='/forms/select2'>{t('select2')}</Link>
                      </li>
                      <li>
                        <Link href='/forms/touchspin'>{t('touchspin')}</Link>
                      </li>
                      <li>
                        <Link href='/forms/checkbox-radio'>
                          {t('checkbox_&_radio')}
                        </Link>
                      </li>
                      <li>
                        <Link href='/forms/switches'>{t('switches')}</Link>
                      </li>
                      <li>
                        <Link href='/forms/wizards'>{t('wizards')}</Link>
                      </li>
                      <li>
                        <Link href='/forms/file-upload'>
                          {t('file_upload')}
                        </Link>
                      </li>
                      <li>
                        <Link href='/forms/quill-editor'>
                          {t('quill_editor')}
                        </Link>
                      </li>
                      <li>
                        <Link href='/forms/markdown-editor'>
                          {t('markdown_editor')}
                        </Link>
                      </li>
                      <li>
                        <Link href='/forms/date-picker'>
                          {t('date_&_range_picker')}
                        </Link>
                      </li>
                      <li>
                        <Link href='/forms/clipboard'>{t('clipboard')}</Link>
                      </li>
                    </ul>
                  </AnimateHeight>
                </li>

                <li className='menu nav-item'>
                  <button
                    type='button'
                    className={`${
                      currentMenu === 'Settings' ? 'active' : ''
                    } nav-link group w-full`}
                    onClick={() => toggleMenu('Settings')}
                  >
                    <div className='flex items-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='19'
                        height='20'
                        viewBox='0 0 19 20'
                        fill='none'
                      >
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M11.2788 0.152241C10.9085 0 10.439 0 9.5 0C8.56102 0 8.09153 0 7.72119 0.152241C7.2274 0.355229 6.83509 0.744577 6.63056 1.23463C6.53719 1.45834 6.50065 1.7185 6.48635 2.09799C6.46534 2.65568 6.17716 3.17189 5.69017 3.45093C5.20318 3.72996 4.60864 3.71954 4.11149 3.45876C3.77318 3.2813 3.52789 3.18262 3.28599 3.15102C2.75609 3.08178 2.22018 3.22429 1.79616 3.5472C1.47814 3.78938 1.24339 4.1929 0.773903 4.99993C0.304414 5.80697 0.069669 6.21048 0.017347 6.60491C-0.0524154 7.1308 0.0911811 7.66266 0.416547 8.08348C0.565055 8.27556 0.773773 8.43703 1.0977 8.63902C1.57391 8.93598 1.88032 9.44186 1.88029 10C1.88026 10.5581 1.57386 11.0639 1.0977 11.3608C0.773716 11.5629 0.564971 11.7244 0.416448 11.9165C0.0910824 12.3373 -0.0525141 12.8691 0.0172484 13.395C0.0695703 13.7894 0.304315 14.193 0.773804 15C1.24329 15.807 1.47804 16.2106 1.79606 16.4527C2.22008 16.7756 2.75599 16.9181 3.28589 16.8489C3.52778 16.8173 3.77305 16.7186 4.11133 16.5412C4.60852 16.2804 5.2031 16.27 5.69012 16.549C6.17714 16.8281 6.46533 17.3443 6.48635 17.9021C6.50065 18.2815 6.53719 18.5417 6.63056 18.7654C6.83509 19.2554 7.2274 19.6448 7.72119 19.8478C8.09153 20 8.56102 20 9.5 20C10.439 20 10.9085 20 11.2788 19.8478C11.7726 19.6448 12.1649 19.2554 12.3694 18.7654C12.4628 18.5417 12.4994 18.2815 12.5137 17.902C12.5347 17.3443 12.8228 16.8281 13.3098 16.549C13.7968 16.2699 14.3914 16.2804 14.8886 16.5412C15.2269 16.7186 15.4721 16.8172 15.714 16.8488C16.2439 16.9181 16.7798 16.7756 17.2038 16.4527C17.5219 16.2105 17.7566 15.807 18.2261 14.9999C18.6956 14.1929 18.9303 13.7894 18.9827 13.395C19.0524 12.8691 18.9088 12.3372 18.5835 11.9164C18.4349 11.7243 18.2262 11.5628 17.9022 11.3608C17.4261 11.0639 17.1197 10.558 17.1197 9.99991C17.1197 9.44185 17.4261 8.93608 17.9022 8.63919C18.2263 8.43715 18.435 8.27566 18.5836 8.08355C18.9089 7.66273 19.0525 7.13087 18.9828 6.60497C18.9304 6.21055 18.6957 5.80703 18.2262 5C17.7567 4.19297 17.522 3.78945 17.2039 3.54727C16.7799 3.22436 16.244 3.08185 15.7141 3.15109C15.4722 3.18269 15.2269 3.28136 14.8887 3.4588C14.3915 3.71959 13.7969 3.73002 13.3099 3.45096C12.8229 3.17191 12.5347 2.65566 12.5136 2.09794C12.4993 1.71848 12.4628 1.45833 12.3694 1.23463C12.1649 0.744577 11.7726 0.355229 11.2788 0.152241ZM9.5 13C11.1695 13 12.5228 11.6569 12.5228 10C12.5228 8.34315 11.1695 7 9.5 7C7.83053 7 6.47716 8.34315 6.47716 10C6.47716 11.6569 7.83053 13 9.5 13Z'
                          fill='#1C274C'
                        />
                      </svg>
                      <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                        {t('Settings')}
                      </span>
                    </div>

                    <div
                      className={
                        currentMenu === 'Settings'
                          ? 'rotate-90'
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
                    height={currentMenu === 'Settings' ? 'auto' : 0}
                  >
                    <ul className='sub-menu text-gray-500'>
                      <li>
                        <Link href='/settings/school-preference'>
                          {t('School Preference')}
                        </Link>
                      </li>
                    </ul>
                  </AnimateHeight>
                </li>
              </ShowTree>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
