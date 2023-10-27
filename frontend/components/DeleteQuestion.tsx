import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { showAlert } from '@/utility-methods/alert';
import { deleteExamQuestion } from '@/api-calls/exam';
import Swal from 'sweetalert2';

const DeleteQuestion = (props: any) => {
  const [del, TriggerDelete] = useState();

  const queryClient = useQueryClient();

  async function x() {
    const gt = await deleteExamQuestion(
      props.sessionID,
      props.user_session.access_token
    );
    console.log(props.sessionID, props.user_session.access_token);
  }

  const showAlert = async (type: number) => {
    if (type === 10) {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: 'Delete',
        padding: '2em',
        customClass: 'sweet-alerts',
      }).then((result) => {
        if (result.value) {
          x();
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
            customClass: 'sweet-alerts',
          });
        }
      });
    }
  };

  return (
    <p
      className=' px-2 pb-3 text-danger hover:bg-white'
      onClick={() => showAlert(10)}
    >
      Delete
    </p>
  );
};

export default DeleteQuestion;
