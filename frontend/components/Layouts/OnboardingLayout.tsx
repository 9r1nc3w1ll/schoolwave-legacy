import { PropsWithChildren } from 'react';
import App from '../../App';
import { useSession } from 'next-auth/react';
import React from 'react';

const OnboardingLayout = ({ children }: PropsWithChildren) =>{
  const session = useSession();

  let g:any = React.Children.toArray(children)
  const el = React.cloneElement(g[0], {user_session:session? session.data : {}})

  return(

    <App>
      <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
        <div>{el}</div>
      </div>
    </App>
  )};

export default OnboardingLayout;
