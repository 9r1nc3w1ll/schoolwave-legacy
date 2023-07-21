import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DefaultLayout from './DefaultLayout';
import React from 'react';
import TeacherDefaultLayout from './TeacherDashbordLayout';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const router = useRouter();
  const { status: sessionStatus, data: user_session } = useSession();
  

  useEffect(() => {
    if (sessionStatus == 'loading' || !router.isReady) return;
    if (sessionStatus == 'unauthenticated') {
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath },
      });
    }
  }, [sessionStatus, router]);

  if (sessionStatus == 'loading') {
    return <>Loading schoolwave...</>;
  } 
  if (sessionStatus == 'authenticated'){
    console.log("The session",user_session)

  }
  if (user_session?.role =='teacher'){
    return sessionStatus == 'authenticated' ? <TeacherDefaultLayout>{children}</TeacherDefaultLayout> : <></>;
  } else {

    return sessionStatus == 'authenticated' ? <DefaultLayout>{children}</DefaultLayout> : <></>;
  }

    
};