import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { createSession } from '@/apicalls/session';
import {useEffect, useState} from 'react'
import { createFeeItem, getDiscounts } from "@/apicalls/fees";
import DiscountSelect from "./DiscountSelect";





interface FormValues {
    start_date: string;
    end_date: string;
    resumption_date: string;
    active: boolean
   };



const CreateFeeItem = ( props:any) => {


  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });

  const { mutate, isSuccess, error } = useMutation(
    (data) =>
      createFeeItem(props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Session Created Successfuly')
        props.refreshList()
        props.exit(false)
        reset()
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  
      },
      onError: (error:any) => {
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
    // tempData.discount = '362fba40-cfbe-4a01-b45c-cf5652ee474a'
    mutate(tempData);                                                                  
  };
  return (
    <div  className="">
      <form className="space-y-5"   onSubmit={handleSubmit(onSubmit)}>
      
        <div>
          <input id="name" type="text" placeholder="Name"  className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <input id="description" type="text" placeholder="Description"  className="form-input" {...register("description")} />
        </div>
        <div>
          <DiscountSelect register={register} trigger={props.user_session_status == 'authenticated'} user_session={props.user_session} />
        </div>
        <div>
        
          <input id="amount" type="number"  placeholder="Amount" className="form-input" {...register("amount", { required: "This field is required" })} />
        </div>
        <div className="flex justify-center items-center mt-8 mx-auto">

          <button  type="submit"  className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFeeItem;