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
import { getClasses } from '@/api-calls/class-api';
import { createExams, getExamsQuestions } from '@/api-calls/exam';
import Select from 'react-select';
import { getSubjects } from '@/api-calls/subjects';

const CreateExam = (props: any) => {
  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Subject'));
  });

  interface classOption {
    id: string;
    name: string;
  }
  interface examsQuestionOption {
    id: string;
    title: string;
  }

  interface subjectsOption {
    id: string;
    name: string;
  }

  const [subjectsOptions, setsubjectsOptions] = useState<subjectsOption[]>([]);

  const [classOptions, setclassOptions] = useState<classOption[]>([]);
  const [examsQuestionOptions, setexamsQuestionOptions] = useState<
    examsQuestionOption[]
  >([]);
  const [date1, setDate1] = useState<any>('2022-07-05');
  const [selectedClass, setSelectedClass] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  type FormData = {
    name: string;
    description: string;
    start_date: string;
    due_date: string;
    weight: string;
    class_name: string;
    selectedQuestions: string[];
    // Add other form fields here
  };

  const {
    data: clasii,
    isSuccess,
    status,
    refetch,
  } = useQuery('classes', () => getClasses(user_session?.access_token), {
    enabled: false,
  });
  const {
    data: examsQuestion,
    isSuccess: isSuccess2,
    status: status2,
    refetch: refetch2,
  } = useQuery(
    'Exam Question',
    () => getExamsQuestions(user_session?.access_token),
    { enabled: false }
  );
  const {
    data: subjects,
    isSuccess: isSuccess3,
    status: status3,
    refetch: refetch3,
  } = useQuery('seubjects', () => getSubjects(user_session?.access_token), {
    enabled: false,
  });

  useEffect(() => {
    if (sessionStatus == 'authenticated') {
      refetch();
      refetch2();
      refetch3();
    }
  }, [sessionStatus, refetch, refetch2]);

  let question_options: any = [];

  useEffect(() => {
    if (isSuccess && clasii && isSuccess2 && examsQuestion) {
      setclassOptions(clasii);
      setexamsQuestionOptions(examsQuestion);
      setsubjectsOptions(subjects);
    }
  }, [isSuccess, clasii, isSuccess2, examsQuestion, isSuccess3]);

  question_options = examsQuestionOptions.map(
    (option: examsQuestionOption) => ({
      value: option.id,
      label: option.title,
    })
  );

  const { register, reset, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });

  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation(
    (data: any) => {
      return createExams(user_session?.access_token, data);
    },
    {
      onSuccess: async (data) => {
        showAlert('success', 'Exam created Successfully');
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
    const extractedQuestions = selectedQuestions.map(
      (value: any) => value.value
    );
    const updatedData = {
      ...data,
      questions: extractedQuestions,
      school: user_session?.school.id,
    };

    mutate(updatedData);
  };

  let class_options: any = [];

  class_options = classOptions.map((option: any) => ({
    label: option.title,
    value: option.id,
  }));

  const handleQuestionChange = (selectedOptions: any) => {
    setSelectedQuestions(selectedOptions);
  };

  return (
    <div className='panel w-50% flex-1 px-3 py-6 ltr:xl:mr-6 rtl:xl:ml-6'>
      <div className='mt-0 w-full border-b-2 pt-0 '>
        <div className='pl-3 text-base font-bold'> Create Exam</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='px-2 py-4 '>
          <div className='py-6 text-xl  font-bold'> Exam Details</div>

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
                Exam Description <span className='text-red-500'>*</span>
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
              <label htmlFor='start_date'>
                {' '}
                Exam Start Date <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                {...register('start_date', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div>

            <div className=''>
              <label htmlFor='due_date'>
                {' '}
                Due Date <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                {...register('due_date', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div>

            <div className=''>
              <label htmlFor='weight'>
                {' '}
                Weight <span className='text-red-500'>*</span>
              </label>
              <input
                placeholder='-2'
                {...register('weight', { required: 'This field is required' })}
                className='form-input'
              />
            </div>

            <div className=''>
              <label htmlFor='class_name'>
                {' '}
                Class Name <span className='text-red-500'>*</span>
              </label>

              <select
                {...register('class_name', {
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

            <div>
              <label htmlFor='subject'>
                {' '}
                Subject <span className='text-red-500'>*</span>
              </label>
              <select
                {...register('subject', { required: 'This field is required' })}
                className='form-input'
                placeholder='Choose'
              >
                <option value='' disabled selected hidden>
                  Select an option
                </option>
                {subjectsOptions?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className=''>
              <label htmlFor='term'>
                {' '}
                Question <span className='text-red-500'>*</span>
              </label>

              <Select
                placeholder='Select an option'
                options={question_options}
                isMulti
                isSearchable
                value={selectedQuestions}
                onChange={handleQuestionChange}
              />
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

export default CreateExam;
