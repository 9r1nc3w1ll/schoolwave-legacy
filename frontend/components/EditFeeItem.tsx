import DiscountSelect from './DiscountSelect';
import { editFeeItem } from '@/api-calls/fees';
import { showAlert } from '@/utility-methods/alert';
import { useForm } from 'react-hook-form';
import {
  FeeItemFormValues,
  FeeItemInterface,
  IClientError,
  ResponseInterface,
  SessionStatus,
  UserSession,
} from '@/types';
import { QueryObserverResult, useMutation } from 'react-query';
import { SetStateAction, useEffect } from 'react';

interface EditFeeItemProps {
  user_session_status: SessionStatus;
  create: boolean;
  user_session: UserSession;
  sessionData: FeeItemInterface;
  exit: React.Dispatch<SetStateAction<boolean>>;
  refreshSession: () => Promise<
    QueryObserverResult<ResponseInterface<FeeItemInterface[]>, unknown>
  >;
}

const EditFeeItem = (props: EditFeeItemProps) => {
  const { register, handleSubmit, reset } = useForm<FeeItemFormValues>({
    shouldUseNativeValidation: true,
  });

  useEffect(() => {
    reset({
      name: props.sessionData.name,
      amount: +props.sessionData.amount,
      description: props.sessionData.description,
      discount: props.sessionData.discount,
    });
  }, []);

  const { mutate } = useMutation(editFeeItem, {
    onSuccess: async () => {
      showAlert('success', 'Fee Item Edited Successfully');
      props.refreshSession();
      props.exit(false);
    },
    onError: (error: IClientError) => {
      showAlert('error', error.message);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    mutate({
      data: {
        name: data.name,
        amount: data.amount,
        school: props.user_session.school?.id,
        description: data.description,
        discount: data.discount,
      },
      id: props.sessionData.id,
      accessToken: props.user_session?.access_token,
    });
  });

  return (
    <div className=''>
      <form className='space-y-5' onSubmit={onSubmit}>
        <div>
          <input
            id='name'
            type='text'
            placeholder='Name'
            className='form-input'
            {...register('name', { required: 'This field is required' })}
          />
        </div>
        <div>
          <input
            id='description'
            type='text'
            placeholder='Description'
            className='form-input'
            {...register('description')}
          />
        </div>
        <div>
          <DiscountSelect
            {...register('discount')}
            trigger={props.user_session_status === 'authenticated'}
            user_session={props.user_session}
          />
        </div>
        <div>
          <input
            id='amount'
            type='number'
            placeholder='Amount'
            className='form-input'
            {...register('amount', { required: 'This field is required' })}
          />
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

export default EditFeeItem;
