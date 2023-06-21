import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DefaultLayout from './DefaultLayout';
import React from 'react';

type Props = {
  children: React.ReactElement;
};

/*
  add the requireAuth property to the page component
  to protect the page from unauthenticated users
  e.g.:
  OrderDetail.requireAuth = true;
  export default OrderDetail;
 */

export const ProtectedLayout = (props:any) => {
  const router = useRouter();
  const { status: sessionStatus, data } = useSession();
  const authorized = sessionStatus === 'authenticated';
  const unAuthorized = sessionStatus === 'unauthenticated';
  const loading = sessionStatus === 'loading';

  let g:any = React.Children.toArray(props.children)
  const el = React.cloneElement(g[0], {user_session:data})


  useEffect(() => {
 
    if (loading || !router.isReady) return;

 
    if (unAuthorized) {
    
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath },
      });
    }
  }, [loading, unAuthorized, sessionStatus, router]);

  if (loading) {
    return <>Loading schoolwave...</>;
  }

  return authorized ? <DefaultLayout> {el}</DefaultLayout>: <></>;
};