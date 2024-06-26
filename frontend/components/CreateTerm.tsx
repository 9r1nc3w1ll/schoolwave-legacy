import { createTerm } from '@/api-calls/session';
import { showAlert } from '@/utility-methods/alert';
import { useMutation } from 'react-query';

const CreateTerm = (props: any) => {
  const { mutate, isLoading, error } = useMutation(
    (data: any) => {
      return createTerm(data, props.userSession.access_token);
    },
    {
      onSuccess: async (data) => {
        showAlert('success', 'Term updated Successfuly');
        props.refreshTerms();
      },
      onError: (error) => {
        showAlert('error', 'An Error Occured');
      },
    }
  );

  const save = (name: string, code: string) => {
    let termData = {
      name: name,
      active: false,
      session: props.selectedSession,
      school: props.userSession?.school.id,
      code: code,
    };
    mutate(termData);
  };

  return (
    <div className='mt-[30px]'>
      <div className='mt-[15px]'>
        <h1>First Term</h1>
        <div className='mt-4 justify-between gap-3 rounded border p-4 md:flex'>
          <div className=' w-1/3'>
            <label className='text-sm'>Start Date</label>
            <input type='date' className='form-input' />{' '}
          </div>
          <div className=' w-1/3'>
            <label className='text-sm'>End Date</label>
            <input type='date' className='form-input' />
          </div>
          <div className=' w-1/3'>
            <button
              className='btn btn-success mt-[10%] w-full'
              onClick={() => {
                save('First Term', '1st Term');
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className='mt-[15px]'>
        <h1>Second Term</h1>
        <div className='mt-4 justify-between gap-3 rounded border p-4 md:flex'>
          <div className=' w-1/3'>
            <label className='text-sm'>Start Date</label>
            <input type='date' className='form-input' />{' '}
          </div>
          <div className=' w-1/3'>
            <label className='text-sm'>End Date</label>
            <input type='date' className='form-input' />
          </div>
          <div className=' w-1/3'>
            <button
              className='btn btn-success mt-[10%] w-full'
              onClick={() => {
                save('Second Term', '2nd Term');
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className='mt-[15px]'>
        <h1>Third Term</h1>
        <div className='mt-4 justify-between gap-3 rounded border p-4 md:flex'>
          <div className=' w-1/3'>
            <label className='text-sm'>Start Date</label>
            <input type='date' className='form-input' />{' '}
          </div>
          <div className=' w-1/3'>
            <label className='text-sm'>End Date</label>
            <input type='date' className='form-input' />
          </div>
          <div className=' w-1/3'>
            <button
              className='btn btn-success mt-[10%] w-full'
              onClick={() => {
                save('Third Term', '3rd Term');
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <button
        className='btn btn-danger mt-8'
        onClick={() => {
          props.exit(false);
        }}
      >
        {' '}
        Exit
      </button>
    </div>
  );
};

export default CreateTerm;
