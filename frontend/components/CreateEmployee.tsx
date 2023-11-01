import Select from 'react-select';
import { setPageTitle } from '@/store/themeConfigSlice';
import { showAlert } from '@/utility-methods/alert';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CreateStaff, getStaffRoles } from '@/api-calls/staffs';
import {
  IClientError,
  RefinedFeeItem,
  SessionStatus,
  UserSession,
} from '@/types';
import React, { SetStateAction, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

type CreateEmployeePropsType = {
  userSession: UserSession;
  setmodal: React.Dispatch<SetStateAction<boolean>>;
  refreshEmployee: () => void;
  user_session_status: SessionStatus;
};
type CreateEmployeeFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  gender: string;
  role: string;
  religion: string;
  phone_number: string;
  city: string;
  state: string;
  address: string;
  is_staff: boolean;
  password: string;
  title: string;
};

const CreateEmployee = (props: CreateEmployeePropsType) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Create Staff'));
  });

  const [roles, setRoles] = useState<RefinedFeeItem[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const { register, handleSubmit } = useForm<CreateEmployeeFormValues>({
    shouldUseNativeValidation: true,
  });
  const { data, refetch } = useQuery(
    'staffRole',
    () => getStaffRoles(props?.userSession?.access_token as string),
    { enabled: false }
  );

  useEffect(() => {
    if (props.user_session_status === 'authenticated') {
      refetch();
    }
  }, [props.user_session_status === 'authenticated']);

  useEffect(() => {
    let refinedFeeItems: RefinedFeeItem[] = [];

    if (data) {
      refinedFeeItems = data.data?.map((itm) => ({
        value: itm.id,
        label: itm.name,
      }));
    }

    setRoles(refinedFeeItems);
  }, [data]);

  const { mutate } = useMutation(CreateStaff, {
    onSuccess: async () => {
      showAlert('success', 'Saved Successfuly');
      props.refreshEmployee();
      props.setmodal(false);
    },
    onError: (error: IClientError) => {
      showAlert('error', error.message);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const transData = { ...data };

    transData.is_staff = true;
    transData.password = data.email;

    mutate({
      accessToken: props.userSession.access_token,
      data: {
        ...transData,
        roles: selectedRoles,
        school: props.userSession.school.id,
      },
    });
  });

  return (
    <div className='panel flex-1 px-3 py-6 ltr:xl:mr-6 rtl:xl:ml-6'>
      <div className='mt-0 w-full border-b-2 pt-0 '>
        <div className='pl-3 text-lg font-bold'> Create New Employee </div>
      </div>
      <form onSubmit={onSubmit}>
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
              <label htmlFor='title'>
                {' '}
                Title <span className='text-red-500'>*</span>
              </label>

              <select {...register('title', {})} className='form-input'>
                <option value=''>-- select an option --</option>
                <option value='Mr'>Mr</option>
                <option value='Mrs'>Mrs</option>
                <option value='Miss'>Miss</option>
              </select>
            </div>

            <div className='my-3'>
              <label htmlFor='username'>
                {' '}
                Username <span className='text-red-500'>*</span>
              </label>

              <input {...register('username', {})} className='form-input' />
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
              <label htmlFor='bloogGroup'>
                {' '}
                Staff Role <span className='text-red-500'>*</span>
              </label>
              <Select
                placeholder='Select an option'
                options={roles}
                isMulti
                isSearchable={true}
                onChange={(e) => {
                  const dataofInterest: string[] = [];

                  e.forEach((itm) => {
                    dataofInterest.push(itm.value);
                  });
                  setSelectedRoles(dataofInterest);
                }}
              />
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

export default CreateEmployee;
