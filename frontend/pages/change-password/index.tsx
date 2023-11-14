import BlankLayout from '@/components/Layouts/BlankLayout';
import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { AuthenticationRoute } from '@/components/Layouts/AuthenticationRoute';
import { showAlert } from '@/utility-methods/alert';
import { resetPassword } from '@/api-calls/password-reset';
import { ResetPassword } from '@/models/User';
import { useMutation } from 'react-query';
import { IClientError } from '@/types';
import { Loader } from '@mantine/core';

const ChangePassword = () => {
  const router = useRouter();

  const { hashed_email, reset_token } = router?.query;

  const requestPassword = async (data: ResetPassword) => {
    const res = await resetPassword(data);
    return res;
  };

  const { mutate, isLoading } = useMutation(requestPassword, {
    onSuccess: async () => {
      showAlert('success', 'Password Successfully Updated');
      router.push('/login');
    },
    onError: (error: IClientError) => {
      showAlert('error', error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassword>();

  const onSubmit = handleSubmit(async (data: ResetPassword) => {
    const payload: ResetPassword = {
      hashed_email: hashed_email as string,
      token: reset_token as string,
      confirm_password: data?.confirm_password,
      password: data?.password,
    };
    mutate(payload);
  });

  return (
    <AuthenticationRoute>
      <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
        <div className='panel m-6 w-full max-w-lg sm:w-[480px]'>
          <h2 className='mb-3 text-2xl font-bold'>Change Password</h2>
          <p className='mb-7'>Enter New Password</p>
          <form className='space-y-5' onSubmit={onSubmit}>
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
                {...register('confirm_password', {
                  required: true,
                  maxLength: 80,
                })}
              />
            </div>
            <button type='submit' className='btn btn-primary w-full'>
              {isLoading ? <Loader /> : 'Request Password Reset'}
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
