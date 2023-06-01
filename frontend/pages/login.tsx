import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from 'react';

import { useRouter } from 'next/router';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { signIn } from 'next-auth/react';
import { AuthenticationRoute } from '@/components/Layouts/AuthenticationRoute';

const MySwal = withReactContent(Swal)

const LoginBoxed = () => {
  const router = useRouter()


  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data: any) => {
    const result = await signIn('credentials', { username: data.email, password: data.password, redirect: false, callbackUrl: '/' })
    if(result.ok){
      MySwal.fire({
        confirmButtonText: 'Proceed to your dashboard',
        html: (
          <div className='w-3/5 mx-auto center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-success mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className='text-success text-center'>Log in was successful</p>
          </div>
        ),

      }).then(() => {
        router.push('/')
      });
    }else{
      let err = JSON.parse(result?.error)
      MySwal.fire({
        confirmButtonText: 'ok',
       
        html: (
          <div className='w-3/5 mx-auto center '>
           
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-danger mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>

            <p className='text-danger text-center'>{err.message.message}</p>
          </div>
        ),

      }).then(() => {
  
      });
    }
  
  };

  // const submitForm = (e: any) => {
  //   e.preventDefault();
  //   router.push('/');
  // };

  return (
    <AuthenticationRoute>
      <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
        <div className="panel m-6 w-full max-w-lg sm:w-[480px]">
          <h2 className="mb-3 text-2xl font-bold">Sign In</h2>
          <p className="mb-7">Enter your email and password to login</p>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="form-input" placeholder="Enter Email"  {...register("email", { required: true, maxLength: 80 })} />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" className="form-input" placeholder="Enter Password"  {...register("password", { required: true, maxLength: 80 })} />
            </div>
   
   
            <button type="submit" className="btn btn-primary w-full">
            SIGN IN
            </button>
          </form>
   
        </div>
      </div>
    </AuthenticationRoute>
  );
};
LoginBoxed.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>;
};
export default LoginBoxed;
