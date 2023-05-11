import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useRouter } from 'next/router';
import OnboardingLayout from '@/components/Layouts/OnboardingLayout';
const Step2 = () => {
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
      <h2 className="mb-5 text-2xl font-bold">
      
                   School Information
      </h2>
      <p className="mb-7">Provide the information below so we can setup your school for you</p>
      <form className="space-y-4" onSubmit={submitForm}>

     
        <div className="relative">
          <span className="absolute top-2.5 text-primary ltr:left-2 rtl:right-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <path
                opacity="0.5"
                d="M16.6522 3.45508C16.6522 3.45508 16.7333 4.83381 17.9499 6.05034C19.1664 7.26687 20.5451 7.34797 20.5451 7.34797M10.1002 15.5876L8.4126 13.9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M16.652 3.45506L17.3009 2.80624C18.3759 1.73125 20.1188 1.73125 21.1938 2.80624C22.2687 3.88124 22.2687 5.62415 21.1938 6.69914L20.5449 7.34795L14.5801 13.3128C14.1761 13.7168 13.9741 13.9188 13.7513 14.0926C13.4886 14.2975 13.2043 14.4732 12.9035 14.6166C12.6485 14.7381 12.3775 14.8284 11.8354 15.0091L10.1 15.5876L8.97709 15.9619C8.71035 16.0508 8.41626 15.9814 8.21744 15.7826C8.01862 15.5837 7.9492 15.2897 8.03811 15.0229L8.41242 13.9L8.99089 12.1646C9.17157 11.6225 9.26191 11.3515 9.38344 11.0965C9.52679 10.7957 9.70249 10.5114 9.90743 10.2487C10.0812 10.0259 10.2832 9.82394 10.6872 9.41993L16.652 3.45506Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                opacity="0.5"
                d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input type="text" className="form-input ltr:pl-8 rtl:pr-8" placeholder="School Name" />
        </div>
        <div className="relative">
          <span className="absolute top-2.5 text-primary ltr:left-2 rtl:right-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                opacity="0.5"
                d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input type="text" className="form-input ltr:pl-8 rtl:pr-8" placeholder="School Address" />

        </div>
        <button type="submit" className="btn btn-primary w-full">
                        Create School
        </button>
      </form>
    </div>
 
  );
};

Step2.getLayout = (page: any) => {
  return <OnboardingLayout>{page}</OnboardingLayout>;
};

export default Step2;
