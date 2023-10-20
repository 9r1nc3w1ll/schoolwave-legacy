import { editInvoice } from '@/api-calls/fees';
import { showAlert } from '@/utility_methods/alert';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { IClientError, InvoiceTypes } from '@/types';
import React, { SetStateAction, useEffect } from 'react';

export interface EditInvoiceFormvalues {
  name: string;
  description: string;
  amountPaid: number;
  balance: number;
  outstanding_balance: number;
  template: string;
}

interface EditInvoiceProps {
  access_token: string;
  school: string;
  invoice: InvoiceTypes;
  seteditModal: React.Dispatch<SetStateAction<boolean>>;
  refreshInvoice: () => void;
}

const EditInvoice = (props: EditInvoiceProps) => {
  const { register, handleSubmit, reset } = useForm<EditInvoiceFormvalues>({
    shouldUseNativeValidation: true,
  });

  const { mutate: handleEditInvoice } = useMutation(editInvoice, {
    onSuccess: () => {
      showAlert('success', 'Invoice Edited Successfuly');
      props.refreshInvoice();
      props.seteditModal(false);
    },
    onError: (e: IClientError) => {
      showAlert('error', e.message);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    handleEditInvoice({
      data: {
        name: data.name,
        description: data.description,
        amount_paid: +data.amountPaid,
        balance: +data.balance,
        outstnding_balance: +data.outstanding_balance,
        template: data.template,
        school: props.school,
      },
      accessToken: props.access_token,
      id: props.invoice.id,
    });
  });

  useEffect(() => {
    if (props.invoice) {
      reset({
        name: props?.invoice?.name,
        description: props?.invoice?.description,
        amountPaid: +props?.invoice?.amount_paid,
        balance: +props?.invoice?.balance,
        outstanding_balance: +props?.invoice.outstanding_balance,
        template: props?.invoice?.template,
      });
    }
  }, [props.invoice]);

  return (
    <div>
      <form className='space-y-5' onSubmit={onSubmit}>
        <h1>Edit Invoice</h1>
        <div>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            placeholder='Name'
            className='form-input'
            {...register('name', { required: false })}
          />
        </div>
        <div>
          <label htmlFor='description'>Description</label>
          <input
            id='description'
            type='text'
            placeholder='Description'
            className='form-input'
            {...register('description')}
          />
        </div>
        <div>
          <label htmlFor='amountPaid'>Amount Paid</label>
          <input
            id='amountPaid'
            type='number'
            placeholder='Amount Paid'
            className='form-input'
            {...register('amountPaid', { required: false })}
          />
        </div>
        <div>
          <label htmlFor='balance'>Balance</label>
          <input
            id='balance'
            type='number'
            placeholder='Balance'
            className='form-input'
            {...register('balance', { required: false })}
          />
        </div>
        <div>
          <label htmlFor='outstandingBalance'>Outstanding Balance</label>
          <input
            id='outstandingBalance'
            type='number'
            placeholder='Outstanding Balance'
            className='form-input'
            {...register('outstanding_balance', { required: false })}
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

export default EditInvoice;
