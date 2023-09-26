import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { Avatar } from '@mantine/core';
import { getInitials } from '@/utility_methods/helpers';

const TeacherSidebar = (props: any) => {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark
  );
  const [schoolname1, setschoolname1] = useState('');
  const [schoolname2, setschoolname2] = useState('');
  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };
  useEffect(() => {
    let sch = props.user_session?.school.name.split(' ');
    if (sch) {
      setschoolname1(sch[0]);
      setschoolname2(sch.length > 1 ? '...' : '');
    }
  }, [props.user_session]);
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
                {getInitials(schoolname1, schoolname2)}
              </Avatar>
              <span className='align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline'>
                {`${schoolname1} ${schoolname2} `}
              </span>
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
                <span>{t('Teacher Dashboard')}</span>
              </h2>

              <ul className='nav-list'>
                <li className='menu nav-item'>
                  <Link href='/attendance_t'>
                    <button type='button' className='nav-link group w-full'>
                      <div className='flex items-center'>
                        {/* Attendance icon */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            opacity='0.5'
                            d='M2 8V12C2 14.8284 2 16.2426 2.87868 17.1213C3.35503 17.5977 3.98877 17.8158 4.9199 17.9156C4.9939 17.8157 5.06395 17.737 5.11392 17.6821C5.23008 17.5543 5.37739 17.4091 5.5202 17.2683L7.01311 15.7962L7.56446 15.2377C7.9268 13.1151 9.77461 11.5 12.0001 11.5C14.2255 11.5 16.0733 13.1151 16.4357 15.2377L16.987 15.7962L18.48 17.2684C18.6228 17.4092 18.7701 17.5544 18.8862 17.6821C18.9362 17.737 19.0062 17.8157 19.0802 17.9156C20.0113 17.8158 20.645 17.5977 21.1213 17.1213C22 16.2426 22 14.8284 22 12V8C22 5.17157 22 3.75736 21.1213 2.87868C20.2426 2 18.8284 2 16 2H8C5.17157 2 3.75736 2 2.87868 2.87868C2 3.75736 2 5.17157 2 8Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M7 8.75C6.58579 8.75 6.25 9.08579 6.25 9.5C6.25 9.91421 6.58579 10.25 7 10.25H17C17.4142 10.25 17.75 9.91421 17.75 9.5C17.75 9.08579 17.4142 8.75 17 8.75H7Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M8.25 6C8.25 5.58579 8.58579 5.25 9 5.25H15C15.4142 5.25 15.75 5.58579 15.75 6C15.75 6.41421 15.4142 6.75 15 6.75H9C8.58579 6.75 8.25 6.41421 8.25 6Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M9.00111 15.9174C9.00037 15.9449 9 15.9724 9 16C9 17.6569 10.3431 19 12 19C13.6569 19 15 17.6569 15 16C15 15.9724 14.9996 15.9449 14.9989 15.9174C14.9551 14.2987 13.6292 13 12 13C10.4467 13 9.16912 14.1805 9.01549 15.6933C9.00798 15.7672 9.00315 15.842 9.00111 15.9174Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M7.6757 17.2494L6.59523 18.3148C6.27116 18.6344 6.10913 18.7942 6.05306 18.9295C5.92529 19.2378 6.03463 19.5799 6.31283 19.7421C6.43491 19.8132 6.65512 19.8354 7.09553 19.8798C7.3442 19.9048 7.46853 19.9173 7.57266 19.9554C7.80579 20.0405 7.98715 20.2193 8.07345 20.4492C8.112 20.5519 8.1247 20.6745 8.1501 20.9197C8.19509 21.354 8.21758 21.5711 8.28977 21.6915C8.45425 21.9659 8.80111 22.0737 9.1138 21.9477C9.25102 21.8924 9.41306 21.7326 9.73713 21.413L10.8175 20.343C9.30505 19.9322 8.10917 18.7524 7.6757 17.2494Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M13.1825 20.343L14.2629 21.413C14.5869 21.7326 14.749 21.8924 14.8862 21.9477C15.1989 22.0737 15.5457 21.9659 15.7102 21.6915C15.7824 21.5711 15.8049 21.354 15.8499 20.9197C15.8753 20.6745 15.888 20.5519 15.9265 20.4492C16.0129 20.2193 16.1942 20.0405 16.4273 19.9554C16.5315 19.9173 16.6558 19.9048 16.9045 19.8798C17.3449 19.8354 17.5651 19.8132 17.6872 19.7421C17.9654 19.5799 18.0747 19.2378 17.9469 18.9295C17.8909 18.7942 17.7288 18.6344 17.4048 18.3148L16.3243 17.2494C15.8908 18.7524 14.6949 19.9322 13.1825 20.343Z'
                            fill='#1C274D'
                          />
                        </svg>
                        <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                          Attendance
                        </span>
                      </div>
                    </button>
                  </Link>
                </li>

                <li className='menu nav-item'>
                  <Link href='/lesson_notes'>
                    <button type='button' className='nav-link group w-full'>
                      <div className='flex items-center'>
                        {/* Attendance icon */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            opacity='0.5'
                            d='M4.72718 2.73332C5.03258 2.42535 5.46135 2.22456 6.27103 2.11478C7.10452 2.00177 8.2092 2 9.7931 2H14.2069C15.7908 2 16.8955 2.00177 17.729 2.11478C18.5387 2.22456 18.9674 2.42535 19.2728 2.73332C19.5782 3.0413 19.7773 3.47368 19.8862 4.2902C19.9982 5.13073 20 6.24474 20 7.84202L20 18H7.42598C6.34236 18 5.96352 18.0057 5.67321 18.0681C5.15982 18.1785 4.71351 18.4151 4.38811 18.7347C4.27837 18.8425 4.22351 18.8964 4.09696 19.2397C4.02435 19.4367 4 19.5687 4 19.7003V7.84202C4 6.24474 4.00176 5.13073 4.11382 4.2902C4.22268 3.47368 4.42179 3.0413 4.72718 2.73332Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M20 18H7.42598C6.34236 18 5.96352 18.0057 5.67321 18.0681C5.15982 18.1785 4.71351 18.4151 4.38811 18.7347C4.27837 18.8425 4.22351 18.8964 4.09696 19.2397C3.97041 19.5831 3.99045 19.7288 4.03053 20.02C4.03761 20.0714 4.04522 20.1216 4.05343 20.1706C4.16271 20.8228 4.36259 21.1682 4.66916 21.4142C4.97573 21.6602 5.40616 21.8206 6.21896 21.9083C7.05566 21.9986 8.1646 22 9.75461 22H14.1854C15.7754 22 16.8844 21.9986 17.7211 21.9083C18.5339 21.8206 18.9643 21.6602 19.2709 21.4142C19.4705 21.254 19.6249 21.0517 19.7385 20.75H8C7.58579 20.75 7.25 20.4142 7.25 20C7.25 19.5858 7.58579 19.25 8 19.25H19.9754C19.9926 18.8868 19.9982 18.4741 20 18Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M7.25 7C7.25 6.58579 7.58579 6.25 8 6.25H16C16.4142 6.25 16.75 6.58579 16.75 7C16.75 7.41421 16.4142 7.75 16 7.75H8C7.58579 7.75 7.25 7.41421 7.25 7Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M8 9.75C7.58579 9.75 7.25 10.0858 7.25 10.5C7.25 10.9142 7.58579 11.25 8 11.25H13C13.4142 11.25 13.75 10.9142 13.75 10.5C13.75 10.0858 13.4142 9.75 13 9.75H8Z'
                            fill='#1C274D'
                          />
                        </svg>
                        <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                          Lesson Notes
                        </span>
                      </div>
                    </button>
                  </Link>
                </li>

                <li className='menu nav-item'>
                  <Link href='/examination'>
                    <button type='button' className='nav-link group w-full'>
                      <div className='flex items-center'>
                        {/* Attendance icon */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            opacity='0.5'
                            fill-rule='evenodd'
                            clip-rule='evenodd'
                            d='M2 12C2 16.714 2 19.0711 3.46447 20.5355L20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M8 4.75C8.41421 4.75 8.75 5.08579 8.75 5.5L8.75 7.25002H10.5C10.9142 7.25002 11.25 7.58581 11.25 8.00002C11.25 8.41423 10.9142 8.75002 10.5 8.75002H8.75L8.75 10.5C8.75 10.9142 8.41421 11.25 8 11.25C7.58579 11.25 7.25 10.9142 7.25 10.5L7.25 8.75002H5.5C5.08579 8.75002 4.75 8.41423 4.75 8.00002C4.75 7.58581 5.08579 7.25002 5.5 7.25002H7.25V5.5C7.25 5.08579 7.58579 4.75 8 4.75Z'
                            fill='#1C274D'
                          />
                          <path
                            fill-rule='evenodd'
                            clip-rule='evenodd'
                            d='M12.0004 21.9999C7.28633 21.9999 4.92931 21.9999 3.46484 20.5354L20.5359 3.46436C22.0004 4.92882 22.0004 7.28584 22.0004 11.9999C22.0004 16.7139 22.0004 19.071 20.5359 20.5354C19.0714 21.9999 16.7144 21.9999 12.0004 21.9999ZM18.0005 17.75C18.4147 17.75 18.7505 17.4142 18.7505 17C18.7505 16.5858 18.4147 16.25 18.0005 16.25H13.0005C12.5863 16.25 12.2505 16.5858 12.2505 17C12.2505 17.4142 12.5863 17.75 13.0005 17.75H18.0005Z'
                            fill='#1C274D'
                          />
                        </svg>
                        <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                          Exams/Quiz
                        </span>
                      </div>
                    </button>
                  </Link>
                </li>

                <li className='menu nav-item'>
                  <Link href='/grading'>
                    <button type='button' className='nav-link group w-full'>
                      <div className='flex items-center'>
                        {/* Attendance icon */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            opacity='0.5'
                            d='M12 22C7.75736 22 5.63604 22 4.31802 20.5355C3 19.0711 3 16.714 3 12C3 7.28595 3 4.92893 4.31802 3.46447C5.63604 2 7.75736 2 12 2C16.2426 2 18.364 2 19.682 3.46447C21 4.92893 21 7.28595 21 12C21 16.714 21 19.0711 19.682 20.5355C18.364 22 16.2426 22 12 22Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M15 6H9C8.53501 6 8.30252 6 8.11177 6.05111C7.59413 6.18981 7.18981 6.59413 7.05111 7.11177C7 7.30252 7 7.53501 7 8C7 8.46499 7 8.69748 7.05111 8.88823C7.18981 9.40587 7.59413 9.81019 8.11177 9.94889C8.30252 10 8.53501 10 9 10H15C15.465 10 15.6975 10 15.8882 9.94889C16.4059 9.81019 16.8102 9.40587 16.9489 8.88823C17 8.69748 17 8.46499 17 8C17 7.53501 17 7.30252 16.9489 7.11177C16.8102 6.59413 16.4059 6.18981 15.8882 6.05111C15.6975 6 15.465 6 15 6Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M8 18C8.55228 18 9 17.5523 9 17C9 16.4477 8.55228 16 8 16C7.44772 16 7 16.4477 7 17C7 17.5523 7.44772 18 8 18Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z'
                            fill='#1C274D'
                          />
                          <path
                            d='M16 18C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16C15.4477 16 15 16.4477 15 17C15 17.5523 15.4477 18 16 18Z'
                            fill='#1C274D'
                          />
                        </svg>
                        <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                          Grading
                        </span>
                      </div>
                    </button>
                  </Link>
                </li>

                <li className='menu nav-item'>
                  <Link href='/class_t'>
                    <button type='button' className='nav-link group w-full'>
                      <div className='flex items-center'>
                        {/* Attendance icon */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            opacity='0.5'
                            d='M10.5613 2.25C10.4478 2.24998 10.3595 2.24997 10.2759 2.25503C9.21545 2.31926 8.28686 2.98855 7.89059 3.97425C7.85866 4.05369 7.83027 4.13863 7.79232 4.25251C7.70897 4.47684 7.51771 4.73199 7.24986 4.93586C7.22004 4.95855 7.1901 4.97999 7.16016 5.00017L9.10215 5C9.13102 4.94044 9.15763 4.87988 9.18178 4.81842L9.18332 4.81492L9.18749 4.80502L9.19237 4.7929L9.19695 4.78093L9.20059 4.77098L9.20237 4.76597L9.20661 4.75373L9.21044 4.74244L9.21253 4.73617L9.21526 4.72783L9.2175 4.72079L9.21929 4.71502C9.25812 4.59872 9.2708 4.56246 9.28234 4.53375C9.46246 4.08571 9.88455 3.78148 10.3666 3.75229C10.3988 3.75034 10.4384 3.75 10.5817 3.75H13.4195C13.5629 3.75 13.6024 3.75034 13.6347 3.75229C14.1167 3.78148 14.5388 4.08571 14.7189 4.53375C14.7303 4.56204 14.7423 4.59698 14.7817 4.71499L14.7835 4.72071L14.7857 4.72778L14.7885 4.73614L14.7905 4.74239L14.7944 4.75366L14.7986 4.76588L14.8004 4.77089L14.804 4.78081L14.8086 4.79271L14.8134 4.80471L14.8175 4.81449L14.8191 4.81811C14.8433 4.87968 14.8699 4.94034 14.8988 5L16.8407 5.00017C16.8108 4.98 16.7809 4.95858 16.7511 4.93589C16.4833 4.73205 16.2921 4.47692 16.2087 4.25254L16.2057 4.24347C16.1698 4.13581 16.1419 4.05194 16.1106 3.97426C15.7144 2.98855 14.7858 2.31926 13.7253 2.25503C13.6418 2.24997 13.5534 2.24998 13.4399 2.25H10.5613Z'
                            fill='#1C274D'
                          />
                          <path
                            fill-rule='evenodd'
                            clip-rule='evenodd'
                            d='M17.1923 5H6.80765C5.12027 5 4.27658 5 3.63268 5.32971C3.07242 5.61659 2.61659 6.07242 2.32971 6.63268C2 7.27658 2 8.12027 2 9.80765C2 10.2366 2 10.4511 2.07336 10.6319C2.13743 10.7898 2.24079 10.9288 2.37363 11.0355C2.52574 11.1577 2.73118 11.2194 3.14206 11.3426L8.5 12.95V14.1627C8.5 14.9283 8.95939 15.6341 9.68682 15.9296L10.2469 16.1572C11.3719 16.6143 12.6281 16.6143 13.7531 16.1572L14.3132 15.9296C15.0406 15.6341 15.5 14.9283 15.5 14.1627V12.95L20.8579 11.3426C21.2688 11.2194 21.4743 11.1577 21.6264 11.0355C21.7592 10.9288 21.8626 10.7898 21.9266 10.6319C22 10.4511 22 10.2366 22 9.80765C22 8.12027 22 7.27658 21.6703 6.63268C21.3834 6.07242 20.9276 5.61659 20.3673 5.32971C19.7234 5 18.8797 5 17.1923 5ZM13.6 12H10.4C10.1791 12 10 12.1819 10 12.4063V14.1627C10 14.3288 10.0996 14.4782 10.2514 14.54L10.8116 14.7675C11.5745 15.0775 12.4255 15.0775 13.1885 14.7675L13.7486 14.54C13.9004 14.4782 14 14.3288 14 14.1627V12.4063C14 12.1819 13.8209 12 13.6 12Z'
                            fill='#1C274D'
                          />
                          <path
                            opacity='0.5'
                            d='M3 11.2998C3.04446 11.3133 3.09172 11.3275 3.14206 11.3426L8.5 12.9499V14.1627C8.5 14.9283 8.95939 15.634 9.68682 15.9296L10.2469 16.1571C11.3719 16.6142 12.6281 16.6142 13.7531 16.1571L14.3132 15.9296C15.0406 15.634 15.5 14.9283 15.5 14.1627V12.9499L20.8579 11.3426C20.9083 11.3275 20.9555 11.3133 21 11.2998V12.2999C20.9991 15.9752 20.9651 19.6879 19.682 20.8284C18.3639 22 16.2426 22 12 22C7.75733 22 5.63601 22 4.318 20.8284C3.03489 19.6879 3.0009 15.9752 3 12.2999V11.2998Z'
                            fill='#1C274D'
                          />
                        </svg>
                        <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                          Classes
                        </span>
                      </div>
                    </button>
                  </Link>
                </li>

                <li className='menu nav-item'>
                  <Link href='/account-settings'>
                    <button type='button' className='nav-link group w-full'>
                      <div className='flex items-center'>
                        {/* Attendance icon */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='19'
                          height='20'
                          viewBox='0 0 19 20'
                          fill='none'
                        >
                          <path
                            opacity='0.5'
                            fill-rule='evenodd'
                            clip-rule='evenodd'
                            d='M11.2788 0.152241C10.9085 0 10.439 0 9.5 0C8.56102 0 8.09153 0 7.72119 0.152241C7.2274 0.355229 6.83509 0.744577 6.63056 1.23463C6.53719 1.45834 6.50065 1.7185 6.48635 2.09799C6.46534 2.65568 6.17716 3.17189 5.69017 3.45093C5.20318 3.72996 4.60864 3.71954 4.11149 3.45876C3.77318 3.2813 3.52789 3.18262 3.28599 3.15102C2.75609 3.08178 2.22018 3.22429 1.79616 3.5472C1.47814 3.78938 1.24339 4.1929 0.773903 4.99993C0.304414 5.80697 0.069669 6.21048 0.017347 6.60491C-0.0524154 7.1308 0.0911811 7.66266 0.416547 8.08348C0.565055 8.27556 0.773773 8.43703 1.0977 8.63902C1.57391 8.93598 1.88032 9.44186 1.88029 10C1.88026 10.5581 1.57386 11.0639 1.0977 11.3608C0.773716 11.5629 0.564971 11.7244 0.416448 11.9165C0.0910824 12.3373 -0.0525141 12.8691 0.0172484 13.395C0.0695703 13.7894 0.304315 14.193 0.773804 15C1.24329 15.807 1.47804 16.2106 1.79606 16.4527C2.22008 16.7756 2.75599 16.9181 3.28589 16.8489C3.52778 16.8173 3.77305 16.7186 4.11133 16.5412C4.60852 16.2804 5.2031 16.27 5.69012 16.549C6.17714 16.8281 6.46533 17.3443 6.48635 17.9021C6.50065 18.2815 6.53719 18.5417 6.63056 18.7654C6.83509 19.2554 7.2274 19.6448 7.72119 19.8478C8.09153 20 8.56102 20 9.5 20C10.439 20 10.9085 20 11.2788 19.8478C11.7726 19.6448 12.1649 19.2554 12.3694 18.7654C12.4628 18.5417 12.4994 18.2815 12.5137 17.902C12.5347 17.3443 12.8228 16.8281 13.3098 16.549C13.7968 16.2699 14.3914 16.2804 14.8886 16.5412C15.2269 16.7186 15.4721 16.8172 15.714 16.8488C16.2439 16.9181 16.7798 16.7756 17.2038 16.4527C17.5219 16.2105 17.7566 15.807 18.2261 14.9999C18.6956 14.1929 18.9303 13.7894 18.9827 13.395C19.0524 12.8691 18.9088 12.3372 18.5835 11.9164C18.4349 11.7243 18.2262 11.5628 17.9022 11.3608C17.4261 11.0639 17.1197 10.558 17.1197 9.99991C17.1197 9.44185 17.4261 8.93608 17.9022 8.63919C18.2263 8.43715 18.435 8.27566 18.5836 8.08355C18.9089 7.66273 19.0525 7.13087 18.9828 6.60497C18.9304 6.21055 18.6957 5.80703 18.2262 5C17.7567 4.19297 17.522 3.78945 17.2039 3.54727C16.7799 3.22436 16.244 3.08185 15.7141 3.15109C15.4722 3.18269 15.2269 3.28136 14.8887 3.4588C14.3915 3.71959 13.7969 3.73002 13.3099 3.45096C12.8229 3.17191 12.5347 2.65566 12.5136 2.09794C12.4993 1.71848 12.4628 1.45833 12.3694 1.23463C12.1649 0.744577 11.7726 0.355229 11.2788 0.152241Z'
                            fill='#1C274C'
                          />
                        </svg>
                        <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                          Account Settings
                        </span>
                      </div>
                    </button>
                  </Link>
                </li>

                <li
                  className='menu nav-item'
                  onClick={() => {
                    signOut();
                  }}
                >
                  <Link href='#'>
                    <button type='button' className='nav-link group w-full'>
                      <div className='flex items-center'>
                        {/* Attendance icon */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <circle cx='12' cy='6' r='4' fill='#1C274C' />
                          <ellipse
                            opacity='0.5'
                            cx='12'
                            cy='17'
                            rx='7'
                            ry='4'
                            fill='#1C274C'
                          />
                        </svg>
                        <span className='text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark'>
                          Logout
                        </span>
                      </div>
                    </button>
                  </Link>
                </li>
              </ul>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default TeacherSidebar;
