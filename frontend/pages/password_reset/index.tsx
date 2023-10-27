import BlankLayout from '@/components/Layouts/BlankLayout';
import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { AuthenticationRoute } from '@/components/Layouts/AuthenticationRoute';
import { showAlert } from '@/utility-methods/alert';

const PasswordReset = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    const result: any = await signIn('credentials', {
      username: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: '/',
    });
    if (result.ok) {
      showAlert('success', 'Logged in Successfuly');
      router.push('/admin_dashboard');
      return;
    } else {
      showAlert('error', 'An error occured');
    }
  };

  return (
    <AuthenticationRoute>
      <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
        <div className='panel m-6 w-full max-w-lg sm:w-[480px]'>
          <h2 className='mb-3 text-2xl font-bold'>Password Reset</h2>
          <p className='mb-7'>
            Enter your email to request for password request token
          </p>
          <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                type='email'
                className='form-input'
                placeholder='Enter Email'
                {...register('email', { required: true, maxLength: 80 })}
              />
            </div>
            <button type='submit' className='btn btn-primary w-full'>
              Request Password Reset
            </button>
          </form>
        </div>
      </div>
    </AuthenticationRoute>
  );
};
PasswordReset.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>;
};
export default PasswordReset;
