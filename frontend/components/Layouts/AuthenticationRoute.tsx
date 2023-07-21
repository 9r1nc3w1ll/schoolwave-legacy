import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type Props = {
  children: React.ReactElement;
};

export const AuthenticationRoute = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const { status: sessionStatus, data:user_session } = useSession();

  useEffect(() => {
    if (sessionStatus == 'loading' || !router.isReady) return;

    if (sessionStatus == 'authenticated') {
  
      
      router.push({
        pathname: '/',
        query: { returnUrl: router.asPath },
      });
    }
  }, [sessionStatus, router]);

  if (sessionStatus == 'loading') {
    return <>Loading schoolwave...</>;
  }

  // TODO: Redirect to 403 or 404
  
  return sessionStatus !== 'authenticated' ? <>{children}</> : <></>;
};