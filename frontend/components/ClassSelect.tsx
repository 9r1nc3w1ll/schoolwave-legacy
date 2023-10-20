import { Session } from 'next-auth/core/types';
import { getClasses } from '@/api-calls/class-api';
import { useQuery } from 'react-query';
import React, { useEffect } from 'react';

interface ClassSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  triggerFetch: boolean;
  userSession: Session | null;
}

const ClassSelect = React.forwardRef<HTMLSelectElement, ClassSelectProps>(
  ({ triggerFetch, userSession, ...rest }, ref) => {
    const { data: classes, refetch } = useQuery(
      'getClasses',
      () => {
        return getClasses(userSession?.access_token);
      },
      { enabled: false }
    );

    useEffect(() => {
      refetch();
    }, [refetch, triggerFetch]);

    return (
      <div className='mb-8'>
        <label>Class</label>
        <select
          className='form-select text-white-dark'
          id='class'
          ref={ref}
          {...rest}
        >
          <option>-- select One-- </option>
          {classes?.map((clss) => (
            <option key={clss.id} value={clss.id}>
              {' '}
              {clss.name}{' '}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

ClassSelect.displayName = 'ClassSelect';

export default ClassSelect;
