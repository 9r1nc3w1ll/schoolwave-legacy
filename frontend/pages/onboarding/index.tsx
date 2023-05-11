import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useRouter } from 'next/router';
import OnboardingLayout from '@/components/Layouts/OnboardingLayout';
import Link from 'next/link';
const Step0 = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Contact Form'));
  });
  const router = useRouter();

  const submitForm = (e: any) => {
    e.preventDefault();
    router.push('/');
  };

  return (
   
    <div className="panel m-6 w-full max-w-lg sm:w-[480px]">
     
      <h2 className="mb-5 text-2xl font-bold text-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block h-7 w-7 text-primary ltr:mr-3 rtl:ml-3">
          <path
            opacity="0.5"
            d="M5 8.51464C5 4.9167 8.13401 2 12 2C15.866 2 19 4.9167 19 8.51464C19 12.0844 16.7658 16.2499 13.2801 17.7396C12.4675 18.0868 11.5325 18.0868 10.7199 17.7396C7.23416 16.2499 5 12.0844 5 8.51464Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M20.9605 15.5C21.6259 16.1025 22 16.7816 22 17.5C22 19.9853 17.5228 22 12 22C6.47715 22 2 19.9853 2 17.5C2 16.7816 2.37412 16.1025 3.03947 15.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
                    Welcome to Schoolwave
      </h2>
      <p className="mb-7 text-center">It appears your school portal is not set up; click next to set up school admin/owner account.</p>
     
      <button type="button" className="btn btn-primary w-2/3 mx-auto">  <Link href='/onboarding/step1'>  Next
      </Link></button>
    </div>
 
  );
};

Step0.getLayout = (page: any) => {
  return <OnboardingLayout>{page}</OnboardingLayout>;
};

export default Step0;
