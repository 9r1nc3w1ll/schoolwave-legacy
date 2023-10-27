import BlankLayout from '@/components/Layouts/BlankLayout';
import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { AuthenticationRoute } from '@/components/Layouts/AuthenticationRoute';
import { showAlert } from '@/utility-methods/alert';

const ChangePassword = () => {
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
          <h2 className='mb-3 text-2xl font-bold'>Change Password</h2>
          <p className='mb-7'>Enter New Password</p>
          <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor='email'>New Password</label>
              <input
                id='password'
                type='password'
                className='form-input'
                placeholder='Enter New Password'
                {...register('password', { required: true, maxLength: 80 })}
              />
            </div>
            <div>
              <label htmlFor='email'>Confirm Password</label>
              <input
                id='confirm-password'
                type='password'
                className='form-input'
                placeholder='Enter Email'
                {...register('confirm-password', { required: true, maxLength: 80 })}
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
ChangePassword.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>;
};
export default ChangePassword;
