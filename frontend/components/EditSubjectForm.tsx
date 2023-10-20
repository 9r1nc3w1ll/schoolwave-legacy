import { PropsWithChildren, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { editSubject } from '@/api-calls/subjects';
import { useState } from 'react';
import { getClasses } from '@/api-calls/class-api';
import { getAllTerms } from '@/api-calls/session';

interface FormValues {
  name: string;
  description: string;
  class_id: string;
  code: string;
  term_id: string;
}

const EditSubjectForm = (props: any) => {
  const { register, handleSubmit, reset, setValue } = useForm({
    shouldUseNativeValidation: true,
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    reset(props.sessionData);
  }, []);
  const { mutate, isLoading, error } = useMutation(
    (data) =>
      editSubject(props.sessionData.id, props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Subject Edited Successfuly');
        props.exit(false);
        props.refreshClasses();
      },
      onError: (error) => {
        showAlert('error', 'An Error Occured');
      },
    }
  );

  const {
    data: clasii,
    isSuccess,
    status,
    refetch,
  } = useQuery('classes', () => getClasses(props.user_session?.access_token), {
    enabled: false,
  });
  const {
    data: term,
    isSuccess: isSuccess2,
    status: status2,
    refetch: refetch2,
  } = useQuery('terms', () => getAllTerms(props.user_session?.access_token), {
    enabled: false,
  });
  interface classOption {
    id: string;
    name: string;
  }
  interface termOption {
    id: string;
    name: string;
  }

  const [classOptions, setclassOptions] = useState<classOption[]>([]);
  const [termOptions, settermOptions] = useState<termOption[]>([]);

  useEffect(() => {
    setclassOptions(clasii as classOption[]);
    settermOptions(term);
    refetch();
    refetch2();
  }, [clasii, term, refetch, refetch2]);

  const onSubmit = async (data: any) => {
    mutate(data);
  };

  useEffect(() => {
    if (props.sessionData) {
      setValue('name', props.sessionData.name);
      setValue('code', props.sessionData.code);
      setValue('description', props.sessionData.description);
      setValue('class_id', props.sessionData.class_id);
      setValue('term', props.sessionData.term);
    }
  }, [props.sessionData, setValue]);

  return (
    <div className=''>
      <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            className='form-input'
            {...register('name', { required: 'This field is required' })}
          />
        </div>

        <div>
          <label htmlFor='name'>Code</label>
          <input
            id='code'
            type='text'
            className='form-input'
            {...register('code', { required: 'This field is required' })}
          />
        </div>
        <div>
          <label htmlFor='name'> Descirption</label>
          <input
            id='description'
            type='text'
            className='form-input'
            {...register('description', { required: 'This field is required' })}
          />
        </div>

        <div>
          <label htmlFor='class_id'>Class</label>
          <select
            id='class_id'
            className='form-input'
            {...register('class_id', { required: 'This field is required' })}
          >
            <option>Select an option</option>
            {classOptions?.map((option) => (
              <option
                key={option.id}
                value={option.id}
                selected={option.id === props.sessionData.class_id}
              >
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='term'>Term</label>
          <select
            id='term'
            className='form-input'
            {...register('term', { required: 'This field is required' })}
          >
            <option>Select an option</option>
            {termOptions?.map((option) => (
              <option
                key={option.id}
                value={option.id}
                selected={option.id === props.sessionData.term}
              >
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className='mx-auto mt-8 flex items-center justify-center'>
          <button type='submit' className='btn btn-primary ltr:ml-4 rtl:mr-4'>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubjectForm;
