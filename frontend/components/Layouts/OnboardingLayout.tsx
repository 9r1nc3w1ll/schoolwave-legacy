import { PropsWithChildren } from 'react';
import App from '../../App';

const OnboardingLayout = ({ children }: PropsWithChildren) => (
  <App>
    <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
      <div>{children}</div>
    </div>
  </App>
);

export default OnboardingLayout;
