import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { signOut, useSession } from 'next-auth/react';
import Logo from 'public/assets/images/logo.svg';

const Index = () => {
  const dispatch = useDispatch();
  const { status: sessionStatus, data: user_session } = useSession();

  const [loggedin, setloggedin] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle('Landing Page'));
  });

  useEffect(() => {
    setloggedin(sessionStatus == 'authenticated');
  }, [sessionStatus]);

  console.log({user_session});
  return (
    <div className=''>
      <span data-cy='content' className='hidden'>
        Landing Page
      </span>
      <header className='z-50 bg-white py-4'>
        <div className='max-w-full px-24'>
          <span data-cy='content'>
            <nav className='flex items-center justify-between gap-x-96'>
              <div>
                <a href='#'>
                  <Image src={Logo} width={40} height={40} alt='logo' />
                </a>
              </div>

              {loggedin ? (
                <button
                  type='button'
                  className='cursor-pointer lg:flex lg:flex-1 lg:justify-end '
                  onClick={() => {
                    signOut();
                  }}
                >
                  Log Out <span aria-hidden='true'>&rarr;</span>
                </button>
              ) : (
                <Link
                  href='/login'
                  className='cursor-pointer lg:flex lg:flex-1 lg:justify-end'
                >
                  Log in <span aria-hidden='true'>&rarr;</span>
                </Link>
              )}
            </nav>
          </span>
        </div>
      </header>

      <section className='pb-12 pt-40 text-center'>
        <div className='relative isolate px-6 lg:px-8'>
          {/* BLURRY BACKGROUND */}
          <div
            className='absolute inset-x-0  -z-10 mt-[150px] transform-gpu overflow-hidden blur-3xl sm:-top-80'
            aria-hidden='true'
          >
            <div
              className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>

          <div className='px-24'>
            <div className=''>
              <h2 className='font-bold uppercase tracking-tight text-gray-900 sm:text-6xl lg:text-2xl'>
                Welcome to
              </h2>
              <h1 className='font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-8xl'>
                schoolwave
              </h1>
              <p className='mt-6 text-lg leading-8 text-gray-600'>
                You are seeing this because your school website is not
                configured yet.
              </p>
              <div className='mt-10 flex items-center justify-center gap-x-6'>
                {loggedin && (
                  <div>
                    <Link
                      href={
                        user_session?.role === 'teacher'
                          ? '/teacher_dashboard'
                          : user_session?.role === 'super_admin'
                          ? '/create_school'
                          : '/admin_dashboard'
                      }
                    >
                      <button
                        type='button'
                        className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      >
                        Go to Dashboard
                      </button>
                    </Link>
                  </div>
                )}
                <a
                  href='#'
                  className='text-sm font-semibold leading-6 text-gray-900'
                >
                  Learn more <span aria-hidden='true'>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <svg
          viewBox='0 0 1428 174'
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g stroke='none' strokeWidth='1' fill='none' fill-rule='evenodd'>
            <g
              transform='translate(-2.000000, 44.000000)'
              fill='#FFFFFF'
              fill-rule='nonzero'
            >
              <path
                d='M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496'
                opacity='0.100000001'
              ></path>
              <path
                d='M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z'
                opacity='0.100000001'
              ></path>
              <path
                d='M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z'
                id='Path-4'
                opacity='0.200000003'
              ></path>
            </g>
            <g
              transform='translate(-4.000000, 76.000000)'
              fill='#FFFFFF'
              fill-rule='nonzero'
            >
              <path d='M0.457,34.035 C57.086,53.198 98.208,65.809 123.822,71.865 C181.454,85.495 234.295,90.29 272.033,93.459 C311.355,96.759 396.635,95.801 461.025,91.663 C486.76,90.01 518.727,86.372 556.926,80.752 C595.747,74.596 622.372,70.008 636.799,66.991 C663.913,61.324 712.501,49.503 727.605,46.128 C780.47,34.317 818.839,22.532 856.324,15.904 C922.689,4.169 955.676,2.522 1011.185,0.432 C1060.705,1.477 1097.39,3.129 1121.236,5.387 C1161.703,9.219 1208.621,17.821 1235.4,22.304 C1285.855,30.748 1354.351,47.432 1440.886,72.354 L1441.191,104.352 L1.121,104.031 L0.457,34.035 Z'></path>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Index;

Index.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>;
};
