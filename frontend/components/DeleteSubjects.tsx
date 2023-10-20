import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { deleteClass } from '@/api-calls/class-api';
import { deleteTerm } from '@/api-calls/session';

const DeleteTerms = (props: any) => {
  const [del, TriggerDelete] = useState();

  const queryClient = useQueryClient();

  async function x() {
    const gt = await deleteTerm(
      props.sessionID,
      props.user_session.access_token
    );

    if (gt.status == 204) {
      queryClient.invalidateQueries(['subjects']);
      showAlert('success', 'Subject Deleted Successfuly');
    } else {
      showAlert('error', 'An Error Occored');
    }
  }

  return (
    <p
      className=' px-2 pb-3 text-danger hover:bg-white'
      onClick={() => {
        x();
      }}
    >
      Delete
    </p>
  );
};

export default DeleteTerms;
