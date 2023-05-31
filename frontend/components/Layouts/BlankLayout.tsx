import { ReactNode } from 'react';
import App from '../../App';

import { SessionProvider } from "next-auth/react"

interface IProps{
  children: ReactNode;
  session: any
}

const BlankLayout = ({ children, session }: IProps) => {
  return (
    <App>
      <SessionProvider session={session}>
        <div className="min-h-screen text-black dark:text-white-dark">{children} </div>
      </SessionProvider>
    </App>
  );
};

export default BlankLayout;
