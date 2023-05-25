import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useRouter } from 'next/router';
import OnboardingLayout from '@/components/Layouts/OnboardingLayout';
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from 'react-query';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { signIn } from 'next-auth/react';

const MySwal = withReactContent(Swal)

interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  username: string;
};

interface FormResponse {
  ok: boolean;
  token: string;
}


const Step1 = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Owner Setup'));
  });
  const router = useRouter();
  const { mutateAsync, isLoading, error } = useMutation(
    {
      async mutationFn(data: any) {
        const { ok, error }: any = await signIn('register', { ...data, redirect: false });
        if (!ok) {
          return Promise.reject(JSON.parse(error))
        }
      },
      async onSuccess(data) {
        MySwal.fire({
          confirmButtonText: 'Next Step',
          html: (
            <div className='w-3/5 mx-auto center'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-success mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className='text-success text-center'>User Created successfully</p>
            </div>
          ),

        }).then(() => {
          router.push('/onboarding/step2')
        });
      },
      onError: (error) => {
        MySwal.fire({
          title: "An Error Occured"
        })
      }
    }
  );

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>();
  const onSubmit = async (data: any) => {
    data.username = data.email
    await mutateAsync(data)
  }

  return (
    <div className="panel m-6 w-full max-w-lg sm:w-[640px]">
      <h2 className="mb-5 text-2xl font-bold">School Owner/Admin Information</h2>
      <p className="mb-7">Provide the information below so we can setup your school admin account </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="space-y-4" disabled={isLoading}>
          <div className="relative">
            <span className="absolute top-2.5 text-primary ltr:left-2 rtl:right-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <input type="text" className="form-input ltr:pl-8 rtl:pr-8" placeholder="First Name" {...register("first_name", { required: true })} />
          </div>
          <div className="relative">
            <span className="absolute top-2.5 text-primary ltr:left-2 rtl:right-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <input type="text" className="form-input ltr:pl-8 rtl:pr-8" placeholder="Last Name"  {...register("last_name", {
              required: true
            })} />
          </div>
          <div className="relative">
            <span className="absolute top-2.5 text-primary ltr:left-2 rtl:right-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path
                  d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 12.7215 17.8726 13.4133 17.6392 14.054C17.5551 14.285 17.4075 14.4861 17.2268 14.6527L17.1463 14.727C16.591 15.2392 15.7573 15.3049 15.1288 14.8858C14.6735 14.5823 14.4 14.0713 14.4 13.5241V12M14.4 12C14.4 13.3255 13.3255 14.4 12 14.4C10.6745 14.4 9.6 13.3255 9.6 12C9.6 10.6745 10.6745 9.6 12 9.6C13.3255 9.6 14.4 10.6745 14.4 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  opacity="0.5"
                  d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <input type="email" className="form-input ltr:pl-8 rtl:pr-8" placeholder="Email" {...register("email", {
              required: true
            })} />
          </div>
          <div className="relative">
            <span className="absolute top-2.5 text-primary ltr:left-2 rtl:right-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path
                  d="M16.1007 13.359L16.5562 12.9062C17.1858 12.2801 18.1672 12.1515 18.9728 12.5894L20.8833 13.628C22.1102 14.2949 22.3806 15.9295 21.4217 16.883L20.0011 18.2954C19.6399 18.6546 19.1917 18.9171 18.6763 18.9651M4.00289 5.74561C3.96765 5.12559 4.25823 4.56668 4.69185 4.13552L6.26145 2.57483C7.13596 1.70529 8.61028 1.83992 9.37326 2.85908L10.6342 4.54348C11.2507 5.36691 11.1841 6.49484 10.4775 7.19738L10.1907 7.48257"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  opacity="0.5"
                  d="M18.6763 18.9651C17.0469 19.117 13.0622 18.9492 8.8154 14.7266C4.81076 10.7447 4.09308 7.33182 4.00293 5.74561"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  opacity="0.5"
                  d="M16.1007 13.3589C16.1007 13.3589 15.0181 14.4353 12.0631 11.4971C9.10807 8.55886 10.1907 7.48242 10.1907 7.48242"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
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
            <input type="password" className="form-input ltr:pl-8 rtl:pr-8" placeholder="Password" {...register("password", {
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
            <input type="password" className="form-input ltr:pl-8 rtl:pr-8" placeholder=" Confirm Password" {...register("confirm_password", {
              required: true,
              validate: (val: string) => {
                const { password } = getValues();
                return password === val || "Passwords should match!";
              },
            })} />
            <p className='text-danger'>{errors.email ? errors.email.message : ''}</p>
            <p className='text-danger'>{errors.last_name ? errors.last_name.message : ''}</p>
            <p className='text-danger'>{errors.first_name ? errors.first_name.message : ''}</p>
            <p className='text-danger'>{errors.password ? errors.password.message : ''}</p>
            <p className='text-danger'>{errors.confirm_password ? errors.confirm_password.message : ''}</p>
          </div>
          <button type="submit" className="btn btn-primary w-full">Create School Admin</button>
        </fieldset>
      </form>
    </div>

  );
};

Step1.getLayout = (page: any) => {
  return <OnboardingLayout>{page}</OnboardingLayout>;
};

export default Step1;
