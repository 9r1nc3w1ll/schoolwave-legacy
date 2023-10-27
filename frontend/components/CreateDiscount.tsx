import { createDiscount } from '@/api-calls/fees';
import { showAlert } from '@/utility-methods/alert';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { DiscountFormValues, IClientError, UserSession } from '@/types';
import React, { SetStateAction, useState } from 'react';

interface CreateDiscountProps {
  user_session: UserSession;
  exit: React.Dispatch<SetStateAction<boolean>>;
  refreshList: () => void;
}

const CreateDiscount = (props: CreateDiscountProps) => {
  const { register, handleSubmit, reset, watch } = useForm<DiscountFormValues>({
    shouldUseNativeValidation: true,
    defaultValues: {
      name: '',
      discount_type: 'amount',
      percentage: 0,
      amount: 0,
      description: '',
    },
  });

  type DiscountType = 'percentage' | 'amount';

  const [discountKind, setDiscountKind] = useState<DiscountType>('amount');

  const { mutate } = useMutation(createDiscount, {
    onSuccess: () => {
      showAlert('success', 'Discount Created Successfuly');
      props.refreshList();
      props.exit(false);
      reset();
    },
    onError: (error: IClientError) => {
      showAlert('error', error.message);
    },
  });

  const onSubmit = handleSubmit(async (tempData) => {
    mutate({
      data: {
        ...tempData,
        school: props.user_session?.school.id,
      },
      accessToken: props.user_session.access_token,
    });
  });

  React.useEffect(() => {
    const subscription = watch(({ discount_type: discountType }) =>
      setDiscountKind(discountType as DiscountType)
    );

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className=''>
      <form className='space-y-5' onSubmit={onSubmit}>
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
          <label htmlFor='description'>Description</label>
          <input
            id='description'
            type='text'
            className='form-input'
            {...register('description', { required: false })}
          />
        </div>
        <div>
          <label
            htmlFor='discount_type'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            Discount Type
          </label>
          <select
            id='discount_type'
            className='form-input'
            {...register('discount_type', {
              required: 'Discount type is required',
            })}
          >
            <option value='percentage'>Percentage</option>
            <option value='amount'>Amount</option>
          </select>
        </div>
        {discountKind === 'amount' && (
          <div>
            <label htmlFor='name'>Amount</label>
            <input
              id='amount'
              type='number'
              className='form-input'
              {...register('amount', { required: 'This field is required' })}
            />
          </div>
        )}
        {discountKind === 'percentage' && (
          <div>
            <label htmlFor='name'>Percentage</label>
            <input
              id='percentage'
              type='number'
              className='form-input'
              {...register('percentage', {
                required: 'This field is required',
              })}
            />
          </div>
        )}
        <div className='mx-auto mt-8 flex items-center justify-center'>
          <button type='submit' className='btn btn-primary ltr:ml-4 rtl:mr-4'>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscount;
