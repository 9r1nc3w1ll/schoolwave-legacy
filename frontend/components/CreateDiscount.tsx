import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { createSession } from '@/apicalls/session';
import {useEffect, useState} from 'react'
import { createDiscount, createFeeItem } from "@/apicalls/fees";
import React from "react";





interface FormValues {
    start_date: string;
    end_date: string;
    resumption_date: string;
    active: boolean
   };



const CreateDiscount = ( props:any) => {


  const { register, handleSubmit, reset, watch } = useForm({ shouldUseNativeValidation: true, defaultValues: {
    name: "",
    discount_type: "amount",
    percentage: null,
    amount: null,
    description: ""
  } });

  const queryClient = useQueryClient();
  type DiscountType = "percentage" | "amount"
  const [discountKind, setDiscountKind] = useState<DiscountType>("amount")

  const { mutate, isLoading } = useMutation(
    (data) =>
      createDiscount(props.user_session.access_token, data),
    {
      onSuccess: (data) => {
        console.log("data: ", data)
        showAlert('success', 'Discount Created Successfuly')
        props.refreshList()
        props.exit(false)
        reset()
      },
      onError: (error:any) => {
        showAlert("error", error.message)
        let x =error.response.data.message.split(' ')

        if(x.indexOf('duplicate') >=0 && x.indexOf('key') >=0  && x.indexOf('constraint') >=0){

          showAlert('error', 'A session with same Start Date or End Date already exist')
        }else{
          showAlert('error', 'An Error Occured' )
        }
      }
    }
  );

  const onSubmit = async (tempData: any) => { 
    tempData.school = props.user_session?.school.id
    mutate(tempData);
  };

  React.useEffect(() => {
    const subscription = watch(({ discount_type }) =>
      setDiscountKind(discount_type as DiscountType)
    )
    return () => subscription.unsubscribe()
  }, [watch])
  return (
    <div  className="">
      <form className="space-y-5"   onSubmit={handleSubmit(onSubmit)}>
      
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text"  className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input id="description" type="text"  className="form-input" {...register("description", { required: false })} />
        </div>
        <div>
          <label htmlFor="discount_type" className="block text-sm font-medium leading-6 text-gray-900">
            Discount Type
          </label>
          <select
            id="discount_type"
            className="form-input"
            {...register("discount_type", { required: "Discount type is required" })}>
            <option value="percentage">Percentage</option>
            <option value="amount">Amount</option>
          </select>
        </div>
        {discountKind === "amount" && <div>
          <label htmlFor="name">Amount</label>
          <input id="amount" type="number"  className="form-input" {...register("amount", { required: "This field is required" })} />
        </div>}
        {discountKind === "percentage" && <div>
          <label htmlFor="name">Percentage</label>
          <input id="percentage" type="number"  className="form-input" {...register("percentage", { required: "This field is required" })} />
        </div>}
        <div className="flex justify-center items-center mt-8 mx-auto">
          <button  type="submit"  className="btn btn-primary ltr:ml-4 rtl:mr-4">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscount;