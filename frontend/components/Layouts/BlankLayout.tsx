import App from '@/App';
import { type ReactNode } from 'react';
interface IProps {
  children: ReactNode;
}

const BlankLayout = ({ children }: IProps) => {

  return (
    <App>
      <div className="min-h-screen text-black dark:text-white-dark">{children} </div>
    </App>
  );
};

export default BlankLayout;
