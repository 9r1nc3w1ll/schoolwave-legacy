import ClassSelect from './ClassSelect';
import DiscountSelect from './DiscountSelect';
import Select from 'react-select';
import { Session } from 'next-auth/core/types';
import { showAlert } from '@/utility-methods/alert';
import { useForm } from 'react-hook-form';
import {
  FeeTemplateFormValues,
  FeeTemplateInterface,
  IClientError,
  RefinedFeeItem,
  SessionStatus,
  UserSession,
} from '@/types';
import { SetStateAction, useEffect, useState } from 'react';
import { editFeeTemplate, getFeeItems } from '@/api-calls/fees';
import { useMutation, useQuery } from 'react-query';

interface EditFeeTemplateProps {
  create: boolean;
  user_session: Session | null;
  exit: React.Dispatch<SetStateAction<boolean>>;
  sessionData: FeeTemplateInterface;
  refreshSession: () => void;
  user_session_status: SessionStatus;
}

const EditFeeTemplate = (props: EditFeeTemplateProps) => {
  const [feeItems, setFeeItems] = useState<RefinedFeeItem[]>([]);
  const [requiredItem, setRequiredItem] = useState<string[]>([]);
  const [optionalItem, setOptionalItem] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm<FeeTemplateFormValues>({
    shouldUseNativeValidation: true,
  });
  const { data, refetch } = useQuery(
    'feeitems',
    () => getFeeItems(props.user_session?.access_token as string),
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

    setFeeItems(refinedFeeItems);
  }, [data]);

  useEffect(() => {
    reset(props.sessionData);
  }, []);

  const { mutate } = useMutation(editFeeTemplate, {
    onSuccess: async () => {
      showAlert('success', 'Fee Template Edited Successfuly');
      props.refreshSession();
      props.exit(false);
    },
    onError: (error: IClientError) => {
      showAlert('error', error?.message);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    mutate({
      data: {
        ...data,
        optional_items: optionalItem,
        required_items: requiredItem,
        school: props.sessionData?.school,
        active: false,
      },
      id: props.sessionData.id,
      accessToken: props.user_session?.access_token as string,
    });
  });

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
          <ClassSelect
            {...register('class_id', { required: 'This field is required' })}
            userSession={props.user_session}
            triggerFetch={props.user_session_status === 'authenticated'}
          />
        </div>
        <div>
          <DiscountSelect
            {...register('discount')}
            trigger={props.user_session_status === 'authenticated'}
            user_session={props.user_session as UserSession}
          />
        </div>
        <div>
          <label htmlFor='name'>Required Fee Items</label>
          <Select
            placeholder='Select an option'
            options={feeItems}
            isMulti
            isSearchable={true}
            onChange={(e) => {
              const dataofInterest: string[] = [];

              e.forEach((itm) => {
                dataofInterest.push(itm.value);
              });
              setRequiredItem(dataofInterest);
            }}
          />
        </div>
        <div>
          <label htmlFor='name'>Optional Fee Items</label>
          <Select
            placeholder='Select an option'
            options={feeItems}
            isMulti
            isSearchable={true}
            onChange={(e) => {
              const dataofInterest: string[] = [];

              e.forEach((itm) => {
                dataofInterest.push(itm.value);
              });
              setOptionalItem(dataofInterest);
            }}
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

export default EditFeeTemplate;
