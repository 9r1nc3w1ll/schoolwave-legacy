import { useSession } from 'next-auth/react';
import App from '@/App';
import { type ReactNode } from 'react';
interface IProps {
  children: ReactNode;
}

const BlankLayout = ({ children }: IProps) => {
  const { data } = useSession();

  return (
    <App>
      <div className="min-h-screen text-black dark:text-white-dark">{children} </div>
    </App>
  );
};

export default BlankLayout;
