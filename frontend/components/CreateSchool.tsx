import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import 'flatpickr/dist/flatpickr.css';
import { useSession } from 'next-auth/react';
import { createSchool } from '@/apicalls/schools';

const CreateSchool = (props: any) => {
  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Admission Request'));
  });

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

  const { mutate, isLoading, error } = useMutation(
    (data: any) => {
      return createSchool(data, user_session?.access_token);
    },
    {
      onSuccess: async (data) => {
        if (!data.error) {
          showAlert('success', 'School has been created successfully');
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
        <div className='pl-3 text-2xl font-bold'> Create School</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='px-2 py-4 '>
          <div className='py-6 text-base  font-bold'> School Details</div>

          <div className=' grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-5'>
            <div className='my-3'>
              <label htmlFor='first_name'>Name </label>
              <input
                {...register('name', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
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
              <label htmlFor='date_of_establishment'>
                Date of Establishment
              </label>
              <input
                type='date'
                {...register('date_of_establishment', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div>

            <div className='my-3'>
              <label htmlFor='website_url'>Website Url </label>
              <input
                {...register('website_url', {
                  required: 'This field is required',
                })}
                className='form-input'
                type='url'
              />
            </div>

            <div className='my-3'>
              <label htmlFor='city'> City </label>
              <input
                {...register('city', { required: 'This field is required' })}
                className='form-input'
              />
            </div>

            <div className='my-3'>
              <label htmlFor='state'> State </label>
              <input
                {...register('state', { required: 'This field is required' })}
                className='form-input'
              />
            </div>
          </div>
          <div className='my-3'>
            <label htmlFor='school description'> Description </label>
            <textarea
              id='ctnTextarea'
              rows={3}
              className='form-textarea'
              {...register('address', { required: 'This field is required' })}
              placeholder='A brief Description about your school'
              required
            ></textarea>
          </div>
        </div>
        <div className='px-2 py-4 '>
          <div className='py-6 text-base  font-bold'>Owner Details</div>
          <div className=' grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-5'>
            <div className='my-3'>
              <label htmlFor='first_name'>First Name </label>
              <input
                {...register('first_name', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div>

            <div className='my-3'>
              <label htmlFor='last_name'> Last Name </label>
              <input
                {...register('last_name', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div>

            <div className='my-3'>
              <label htmlFor='email'> Email </label>
              <input {...register('email')} className='form-input' />
            </div>

            <div className='my-3'>
              <label htmlFor='phone_number'> Mobile No </label>
              <input
                {...register('phone_number', {
                  required: 'This field is required',
                })}
                className='form-input'
              />
            </div>
          </div>
          <button
            type='submit'
            className='btn btn-primary btn-lg !mt-6'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className='inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4'></span>
                Loading
              </>
            ) : (
              <>Save</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSchool;
