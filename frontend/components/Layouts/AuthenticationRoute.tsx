import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

export const AuthenticationRoute = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const { status: sessionStatus, data } = useSession();
  const authorized = sessionStatus === 'authenticated' && data !== null && Object.keys(data).length > 0;
  const unAuthorized = sessionStatus === 'unauthenticated';
  const loading = sessionStatus === 'loading';

  useEffect(() => {
    if (loading || !router.isReady) return;
    if (authorized )  {
  
      router.push({
        pathname: '/',
        query: { returnUrl: router.asPath },
      });
    }
  }, [loading, unAuthorized, sessionStatus,data, router]);

  // if the user refreshed the page or somehow navigated to the protected page
  if (loading) {
    return <>Loading schoolwave...</>;
  }

  // if the user is authorized, render the page
  // otherwise, render nothing while the router redirects him to the login page
  return unAuthorized ? <div> {children}</div> : <></>;
};