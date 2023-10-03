import { useSession } from 'next-auth/react';
import React, { ReactNode } from 'react';

interface ShowTreeProps {
  roles: string[];
  children: ReactNode;
}
const ShowTree: React.FC<ShowTreeProps> = ({ roles, children }) => {
  const { status: sessionStatus, data: userSession } = useSession();
  const isAllowed =
    sessionStatus === 'authenticated' && roles.includes(userSession?.role!);
  return <>{isAllowed && children}</>;
};

export default ShowTree;
