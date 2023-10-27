import InvoiceSelect from './InvoiceSelect';
import { SetStateAction } from 'react';
import { editTransaction } from '@/api-calls/fees';
import { showAlert } from '@/utility-methods/alert';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import {
  IClientError,
  SessionStatus,
  TransactionInterface,
  UserSession,
} from '@/types';

interface EditTransactionProps {
  record: TransactionInterface;
  user_session: UserSession;
  seteditModal: React.Dispatch<SetStateAction<boolean>>;
  refetchTransactions: () => void;
  user_session_status: SessionStatus;
}

export interface CreateTransactionFormvalues {
  status: string;
  invoice_id: string;
}

const EditTransaction = (props: EditTransactionProps) => {
  const { register, handleSubmit, reset, watch } =
    useForm<CreateTransactionFormvalues>({
      shouldUseNativeValidation: true,
      values: {
        status: props?.record?.status,
        invoice_id: props?.record?.invoice_id,
      },
    });

  const { mutate } = useMutation(editTransaction, {
    onSuccess: async () => {
      showAlert('success', 'Transaction edited Successfuly');
      props.refetchTransactions();
      props.seteditModal(false);
      reset();
    },
    onError: (error: IClientError) => {
      showAlert('error', error.message);
    },
  });

  const onSubmit = handleSubmit(async (tnxData) => {
    console.log('props?.user_session?.school: ', props?.user_session?.school);

    mutate({
      ...tnxData,
      id: props?.record?.id,
      accessToken: props?.user_session?.access_token as string,
      school: props?.user_session?.school?.id as string,
    });
  });

  return (
    <div className=''>
      <form className='space-y-5' onSubmit={onSubmit}>
        <h1>Create Transaction</h1>
        <div>
          <InvoiceSelect
            watch={watch}
            register={register}
            user_session_status={props.user_session_status}
            user_session={props.user_session}
          />
        </div>
        <div>
          <label
            htmlFor='status'
            className='block text-sm font-medium leading-6 text-gray-900'
          >
            Status
          </label>
          <select
            id='status'
            className='form-input'
            {...register('status', { required: 'Status is required' })}
          >
            <option value='paid'>Paid</option>
            <option value='cancelled'>Cancelled</option>
            <option value='pending'>Pending</option>
          </select>
        </div>
        <div className='mx-auto mt-8 flex items-center justify-center'>
          <button type='submit' className='btn btn-primary ltr:ml-4 rtl:mr-4'>
            Edit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTransaction;
