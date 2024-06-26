import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { showAlert } from '@/utility-methods/alert';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { parse } from 'json2csv';
import { useSession } from 'next-auth/react';
import { CreateSubject } from '@/api-calls/subjects';
import { getClasses } from '@/api-calls/class-api';
import { getAllTerms } from '@/api-calls/session';

const Subject = (props: any) => {
  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Subject'));
  });

  interface classOption {
    id: string;
    name: string;
  }
  interface termOption {
    id: string;
    name: string;
  }

  const [classOptions, setClassOptions] = useState<classOption[]>([]);
  const [termOptions, setTermOptions] = useState<termOption[]>([]);
  const [date1, setDate1] = useState<any>('2022-07-05');

  const {
    data: classDetails,
    isSuccess,
    status,
    refetch,
  } = useQuery('classes', () => getClasses(user_session?.access_token), {
    enabled: false,
  });
  const {
    data: term,
    isSuccess: isSuccess2,
    status: status2,
    refetch: refetch2,
  } = useQuery('terms', () => getAllTerms(user_session?.access_token), {
    enabled: false,
  });

  useEffect(() => {
    if (sessionStatus == 'authenticated') {
      refetch();
      refetch2();
    }
  }, [sessionStatus, refetch, refetch2]);

  useEffect(() => {
    if (isSuccess && classDetails && isSuccess2 && term) {
      setClassOptions(classDetails);
      setTermOptions(term);
    }
  }, [isSuccess, isSuccess2]);

  const { register, reset, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });

  type FormData = {
    name: string;
    description: string;
    code: string;
    class_id: string;
    term: string;
    // Define other form fields here
  };

  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation(
    (data: any) => {
      return CreateSubject(
        { ...data, school: user_session?.school.id },
        user_session?.access_token
      );
    },
    {
      onSuccess: async (data) => {
        showAlert('success', 'Subject created Successfully');
        reset();
        props.refreshClass();
        props.setmodal(false);
      },
      onError: (error) => {
        showAlert('error', 'An Error Occured');
      },
    }
  );

  const onSubmit = async (data: any) => {
    mutate({ ...data, school: props.user_session.school.id });
  };

  return (
    <div className='panel w-50% flex-1 px-3 py-6 ltr:xl:mr-6 rtl:xl:ml-6'>
      <div className='mt-0 w-full border-b-2 pt-0 '>
        <div className='pl-3 text-base font-bold'> Create Subject</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='px-2 py-4 '>
          <div className='py-6 text-xl  font-bold'> Subject Details</div>

          <div className=' grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-5'>
            <div className=''>
              <label htmlFor='name'>
                {' '}
                Name <span className='text-red-500'>*</span>
              </label>
              <input
                placeholder='English'
                {...register('name', { required: 'This field is required' })}
                className='form-input'
              />
            </div>
            <div className=''>
              <label htmlFor='description'>
                {' '}
                Subject Description <span className='text-red-500'>*</span>
              </label>
              <input
                placeholder='Literature in english'
                {...register('description', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div>

            <div className=''>
              <label htmlFor='code'>
                {' '}
                Subject Code<span className='text-red-500'>*</span>
              </label>
              <input
                placeholder='ENG1 101'
                {...register('code', { required: 'This field is required' })}
                className='form-input'
              />
            </div>
            <div className=''>
              <label htmlFor='class_id'>
                {' '}
                Class <span className='text-red-500'>*</span>
              </label>

              <select
                {...register('class_id', {
                  required: 'This field is required',
                })}
                className='form-input'
                placeholder='Choose'
              >
                <option value='' disabled selected hidden>
                  Select an option
                </option>
                {classOptions?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className=''>
              <label htmlFor='term'>
                {' '}
                Term <span className='text-red-500'>*</span>
              </label>

              <select
                {...register('term', { required: 'This field is required' })}
                className='form-input'
                placeholder='Choose'
              >
                <option value='' disabled selected hidden>
                  Select an option
                </option>
                {termOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type='submit' className='btn btn-primary !mt-6 '>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Subject;
