import BlankLayout from '@/components/Layouts/BlankLayout';
import React from 'react';
import { useForm } from 'react-hook-form';
import { AuthenticationRoute } from '@/components/Layouts/AuthenticationRoute';
import { showAlert } from '@/utility-methods/alert';
import { requestPasswordReset } from '@/api-calls/password-reset';
import { ReqestPasswordPayload } from '@/models/User';
import { useMutation } from 'react-query';
import { IClientError } from '@/types';
import { Loader } from '@mantine/core';

const PasswordReset = () => {

  const requestPassword = async (data: ReqestPasswordPayload) => {
    const res = await requestPasswordReset(data);
    return res;
  };
  const { mutate, isLoading } = useMutation(requestPassword, {
    onSuccess: async () => {
      showAlert('success', 'Password reset successfully sent to your mail ');
    },
    onError: (error: IClientError) => {
      showAlert('error', error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReqestPasswordPayload>();

  const onSubmit = handleSubmit(async (data: ReqestPasswordPayload) => {
    mutate(data);
  });



  return (
    <AuthenticationRoute>
      <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
        <div className='panel m-6 w-full max-w-lg sm:w-[480px]'>
          <h2 className='mb-3 text-2xl font-bold'>Password Reset</h2>
          <p className='mb-7'>
            Enter your email to request for password request token
          </p>
          <form className='space-y-5' onSubmit={onSubmit}>
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
              {isLoading ? <Loader /> : 'Request Password Reset'}
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
