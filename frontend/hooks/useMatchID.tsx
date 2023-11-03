import { useState, useEffect } from 'react';
// import { clientId } from '@/utility-methods/constants';
import { clientId } from '../utility-methods/constants';

export default function useMatchID(schoolId: string) {
  const [authClient, setAuthClient] = useState(schoolId === clientId);

  useEffect(() => {
    setAuthClient(schoolId === clientId);
  }, [schoolId]);

  return { authClient };
}
