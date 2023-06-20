import { PropsWithChildren } from 'react';
import App from '@/App';
import React from 'react';

const OnboardingLayout = ({ children }: PropsWithChildren) => {
  return (
    <App>
      <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
        <div>{children}</div>
      </div>
    </App>
  )
};

export default OnboardingLayout;
