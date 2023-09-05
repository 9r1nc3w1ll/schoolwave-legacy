import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { createUser } from '@/apicalls/users';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { parse } from 'json2csv';
import { useSession } from 'next-auth/react';
import { BulkAdmissionUpload, createAdmission } from '@/apicalls/admissions';

const CreateSchool = (props: any) => {
  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Admission Request'));
  });
  const [date1, setDate1] = useState<any>('2022-07-05');

  const { register, reset, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });

  type FormData = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    date_of_birth: string;
    gender: string;
    blood_group: string;
    religion: string;
    phone_number: string;
    city: string;
    state: string;
    address: string;
    guardian_name: string;
    relation: string;
    guardian_occupation: string;
    guardian_phone_number: string;
    guardian_address: string;
    // Define other form fields here
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];
  const bloodOptions = [
    { value: 'choose', label: 'choose' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB -', label: 'AB-' },
  ];

  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation(
    (data: any) => {
      return createAdmission(data, user_session?.access_token);
    },
    {
      onSuccess: async (data) => {
        if (!data.error) {
          showAlert('success', 'Admission created Successfully');
          reset();
          props.refreshAdmission();
          props.setmodal(false);
        } else {
          showAlert('error', data.message);
        }
      },
      onError: (error: any) => {
        showAlert('error', 'An Error Occured');
      },
    }
  );

  const onSubmit = async (data: any) => {
    mutate(data);
  };

  return (
    <div className='panel flex-1 px-3 py-6 ltr:xl:mr-6 rtl:xl:ml-6'>
      <div className='mt-0 w-full border-b-2 pt-0 '>
        <div className='pl-3 text-lg font-bold'> Create School</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='px-2 py-4 '>
          <div className='py-6 text-lg  font-bold'> School Details</div>

          <div className=' grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-5'>
            <div className='my-3'>
              <label htmlFor='first_name'>Name </label>
              <input
                {...register('first_name', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div>
            {/* <div className='my-3'>
              <label htmlFor='last_name'> Description </label>
              <input
                {...register('last_name', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div> */}

            <div className='my-3'>
              <label htmlFor='email'> Owner </label>
              <input {...register('email')} className='form-input' />
            </div>
            <div className='my-3'>
              <label htmlFor='username'> Username </label>
              <input
                className='form-input'
                {...register('username', {
                  required: 'This field is required',
                })}
              />
            </div>

            <div className='my-3'>
              <label htmlFor='password'> Password </label>
              <input
                type='password'
                {...register('password')}
                className='form-input'
              />
            </div>

            <div className='my-3'>
              <label htmlFor='date_of_birth'> Date of Establishment </label>
              <input
                type='date'
                {...register('date_of_birth', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div>

            <div className='my-3'>
              <label htmlFor='gender'> Motto </label>

              <select
                {...register('gender', { required: 'This field is required' })}
                className='form-input'
                placeholder='Choose'
              >
                <option value='male'>male</option>
                <option value='female'>female</option>
              </select>
            </div>

            <div className='my-3'>
              <label htmlFor='bloogGroup'> Tag </label>
              <select
                {...register('blood_group', {
                  required: 'This field is required',
                })}
                className='form-input'
                placeholder='Choose'
              >
                <option value='O+'>O+</option>
                <option value='O+'>O+ </option>
                <option value='A+'>A+</option>
                <option value='A-'>A-</option>
                <option value='B+'>B+</option>
                <option value='B-'>B- </option>
                <option value='AB+'>AB+</option>
                <option value='AB-'>AB-</option>
              </select>
            </div>

            <div className='my-3'>
              <label htmlFor='religion'>Website Url </label>
              <input
                {...register('religion', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div>

            {/* <div className='my-3'>
              <label htmlFor='phone_number'> Mobile No </label>
              <input
                {...register('phone_number', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div> */}

            {/* <div className='my-3'>
              <label htmlFor='city'> City </label>
              <input
                {...register('city', { required: 'This field is required' })}
                className='form-input'
              />
            </div> */}

            {/* <div className='my-3'>
              <label htmlFor='state'> State </label>
              <input
                {...register('state', { required: 'This field is required' })}
                className='form-input'
              />
            </div> */}
          </div>
          {/* <div className='my-3'>
            <label htmlFor='address'> Address </label>
            <textarea
              id='ctnTextarea'
              rows={3}
              className='form-textarea'
              {...register('address', { required: 'This field is required' })}
              placeholder='Enter Address'
              required
            ></textarea>
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default CreateSchool;
