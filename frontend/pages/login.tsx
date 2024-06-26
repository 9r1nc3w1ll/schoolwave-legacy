import BlankLayout from '@/components/Layouts/BlankLayout';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { AuthenticationRoute } from '@/components/Layouts/AuthenticationRoute';
import { showAlert } from '@/utility-methods/alert';
import Link from 'next/link';
import Loader from '@/components/Loader';

const LoginBoxed = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    setLoading(true);
    const result: any = await signIn('credentials', {
      username: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: '/',
    });
    if (result.ok) {
      showAlert('success', 'Logged in Successfuly');
      setLoading(false);
      router.push('/admin-dashboard');
      return;
    } else {
      setLoading(false);
      showAlert('error', 'An error occured');
    }
  };

  return (
    <AuthenticationRoute>
      <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
        <div className='panel m-6 w-full max-w-lg sm:w-[480px]'>
          <h2 className='mb-3 text-2xl font-bold'>Sign In</h2>
          <p className='mb-7'>Enter your email and password to login</p>
          <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor='email'>Email/Username</label>
              <input
                id='email'
                type='text'
                className='form-input'
                placeholder='Enter Email'
                {...register('email', { required: true, maxLength: 80 })}
              />
            </div>
            <div>
              <label htmlFor='password'>Password</label>
              <input
                id='password'
                type='password'
                className='form-input'
                placeholder='Enter Password'
                {...register('password', { required: true, maxLength: 80 })}
              />
            </div>
            <button type='submit' className='btn btn-primary w-full'>
            {loading ? <Loader /> : "SIGN IN"} 
            </button>
          </form>
          <p className='py-6'>
            <Link
              href='/password-reset'
              className='font-bold text-primary hover:underline ltr:ml-1 rtl:mr-1'
            >
              Forgot Password
            </Link>
          </p>
        </div>
      </div>
    </AuthenticationRoute>
  );
};
LoginBoxed.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>;
};
export default LoginBoxed;
