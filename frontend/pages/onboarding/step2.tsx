import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useRouter } from 'next/router';
import OnboardingLayout from '@/components/Layouts/OnboardingLayout';
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from 'react-query';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

type FormValues = {
  description: string;
  name: string;
  motto: string;
  website_url: string;
  date_of_establishment: string;
  owner: number

};


const Step2 = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Contact Form'));
  });
  const router = useRouter();
  const { mutate, isLoading, error } = useMutation(
    (post) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/school`, {
        method: "POST",
        body: JSON.stringify(post),
        headers: { "Content-type": "application/json" }
      }),
    {
      onSuccess: async (data) => {
        MySwal.fire({
          confirmButtonText: 'Go to Dashboard',
          html: (
            <div className='w-3/5 mx-auto center'> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-success mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg><p className='text-success text-center'>School Created successfully </p></div>
          )
        }).then(() => {
          router.push('/')
        });
      },
      onError: (error) => {
        MySwal.fire({
          title: "An Error Occured"
        })
      }
    }
  );

  const { register, handleSubmit, getValues, formState } = useForm<FormValues>();
  const { errors }: any = formState
  const onSubmit: SubmitHandler<any> = data => {
    // console.log('llll', data)
    mutate(data)
  };

  return (
    <div className="panel m-6 w-full max-w-lg sm:w-[640px]">
      <h2 className="mb-5 text-2xl font-bold">

        School Information
      </h2>
      <p className="mb-7">Provide the information below so we can setup your school for you</p>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <span className="absolute top-2.5 text-primary ltr:left-2 rtl:right-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
              <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <input type="text" className="form-input ltr:pl-8 rtl:pr-8" placeholder="School Name" {...register("name", {
            required: true
          })} />
        </div>
        <div className="relative">
          <span className="absolute top-2.5 text-primary ltr:left-2 rtl:right-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>

          </span>
          <input type="text" className="form-input ltr:pl-8 rtl:pr-8" placeholder="About your school"  {...register("description", {
            required: false
          })} />
        </div>
        <div className="relative">


          <label >Date of Establishment</label>
          <input type="date" className="form-input " placeholder="Date of Establishment" {...register("date_of_establishment", {
            required: true
          })} />
        </div>
        <div className="relative">
          <span className="absolute top-2.5 text-primary ltr:left-2 rtl:right-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>

          </span>
          <input type="text" className="form-input ltr:pl-8 rtl:pr-8" placeholder="School Website" {...register("website_url", {
            required: true
          })} />
        </div>
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
          <input type="text" className="form-input ltr:pl-8 rtl:pr-8" placeholder="School Motto" {...register("motto", {
            required: false
          })} />
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

