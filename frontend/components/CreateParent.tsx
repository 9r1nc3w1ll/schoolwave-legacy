import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility-methods/alert';
import { createUser } from '@/api-calls/users';
import { IUser } from '@/models/User';

const CreateParent = (props: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Create Staff'));
  });

  const { register, handleSubmit } = useForm({
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

  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation(
    (data: IUser) => createUser(data, props.access_token),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Saved Successfuly');
        props.refreshParents();
        props.setmodal(false);
      },
      onError: (error: any) => {
        showAlert('error', 'An Error Occured');
      },
    }
  );

  const onSubmit = async (data: any) => {
    const transData = { ...data };
    transData.role = 'parent';
    transData.password = data.email;
    mutate(transData);
  };

  return (
    <div className='panel flex-1 px-3 py-6 ltr:xl:mr-6 rtl:xl:ml-6'>
      <div className='mt-0 w-full border-b-2 pt-0 '>
        <div className='pl-3 text-lg font-bold'> Create New Parent </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='px-2 py-4 '>
          <div className='py-6 text-lg  font-bold'> Basic Details</div>

          <div className=' grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-5'>
            <div className='my-3'>
              <label htmlFor='first_name'>
                {' '}
                First Name <span className='text-red-500'>*</span>
              </label>
              <input {...register('first_name', {})} className='form-input' />
            </div>
            <div className='my-3'>
              <label htmlFor='last_name'>
                {' '}
                Last Name <span className='text-red-500'>*</span>
              </label>
              <input {...register('last_name', {})} className='form-input' />
            </div>

            <div className='my-3'>
              <label htmlFor='email'>
                {' '}
                email <span className='text-red-500'>*</span>
              </label>
              <input {...register('email', {})} className='form-input' />
            </div>
            <div className='my-3'>
              <label htmlFor='username'>
                {' '}
                User Name <span className='text-red-500'>*</span>
              </label>
              <input className='form-input' {...register('username', {})} />
            </div>

            <div className='my-3'>
              <label htmlFor='gender'>
                {' '}
                Gender <span className='text-red-500'>*</span>
              </label>

              <select {...register('gender', {})} className='form-input'>
                <option value=''>-- select an option --</option>
                <option value='male'>male</option>
                <option value='female'>female</option>
              </select>
            </div>

            <div className='my-3'>
              <label htmlFor='religion'>
                Religion <span className='text-red-500'>*</span>
              </label>
              <input {...register('religion', {})} className='form-input' />
            </div>

            <div className='my-3'>
              <label htmlFor='phone_number'>
                {' '}
                Mobile No <span className='text-red-500'>*</span>
              </label>
              <input {...register('phone_number', {})} className='form-input' />
            </div>

            <div className='my-3'>
              <label htmlFor='city'>
                {' '}
                City <span className='text-red-500'>*</span>
              </label>
              <input {...register('city', {})} className='form-input' />
            </div>

            <div className='my-3'>
              <label htmlFor='state'>
                {' '}
                State <span className='text-red-500'>*</span>
              </label>
              <input {...register('state', {})} className='form-input' />
            </div>
          </div>
          <div className='my-3'>
            <label htmlFor='address'>
              {' '}
              Address <span className='text-red-500'>*</span>
            </label>
            <textarea
              id='ctnTextarea'
              rows={3}
              className='form-textarea'
              {...register('address', {})}
              placeholder='Enter Address'
              required
            ></textarea>
          </div>

          <button type='submit' className='btn btn-primary !mt-6 w-[15%] '>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateParent;
