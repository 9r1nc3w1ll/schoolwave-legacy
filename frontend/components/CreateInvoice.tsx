import ClassSelect from './ClassSelect';
import FeeTemplateSelect from './FeeTemplateSelect';
import { showAlert } from '@/utility-methods/alert';
import { useForm } from 'react-hook-form';
import { IClientError, SessionStatus, UserSession } from '@/types';
import { SetStateAction, useEffect, useState } from 'react';
import { createInvoice, getFeeItems } from '@/api-calls/fees';
import { useMutation, useQuery } from 'react-query';

interface CreateInvoiceProps {
  user_session_status: SessionStatus;
  user_session: UserSession;
  setmodal: React.Dispatch<SetStateAction<boolean>>;
  refreshEmployee: () => void;
}

export interface CreateInvoiceFormvalues {
  template: string;
  classId: string;
}

const CreateInvoice = (props: CreateInvoiceProps) => {
  const [items, setItems] = useState<string[]>([]);
  const { register, handleSubmit, reset, watch } =
    useForm<CreateInvoiceFormvalues>({ shouldUseNativeValidation: true });
  const { refetch } = useQuery(
    'feeitems',
    () => getFeeItems(props.user_session.access_token),
    { enabled: false }
  );

  useEffect(() => {
    if (props.user_session_status === 'authenticated') {
      refetch();
    }
  }, [props.user_session_status === 'authenticated']);

  const { mutate } = useMutation(createInvoice, {
    onSuccess: async () => {
      showAlert('success', 'Invoice generated Successfuly');
      props.refreshEmployee();
      props.setmodal(false);
      reset();
    },
    onError: (error: IClientError) => {
      showAlert('error', error.message);
    },
  });

  const onSubmit = handleSubmit(async ({ classId, template }) => {
    console.log('tempdata: ', items);

    mutate({
      accessToken: props.user_session.access_token,
      items,
      template,
      classId,
    });
  });

  return (
    <div className=''>
      <form className='space-y-5' onSubmit={onSubmit}>
        <h1>Generate Invoice</h1>
        <div>
          <ClassSelect
            {...register('classId', { required: 'This field is required' })}
            userSession={props.user_session}
            triggerFetch={props.user_session_status === 'authenticated'}
          />
        </div>
        <div>
          <FeeTemplateSelect
            setItems={setItems}
            watch={watch}
            register={register}
            user_session_status={props.user_session_status}
            user_session={props.user_session}
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

export default CreateInvoice;
