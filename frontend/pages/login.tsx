import Link from 'next/link';
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

    if (result?.ok) {
      router.push('/')
    }

  };

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
