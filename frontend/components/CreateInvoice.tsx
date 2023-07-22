import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { createSession } from '@/apicalls/session';
import {useEffect, useState} from 'react'
import { createFeeItem, createFeeTemplate, createInvoice, getFeeItems } from "@/apicalls/fees";
import Select from 'react-select';
import ClassSelect from "./ClassSelect";
import DiscountSelect from "./DiscountSelect";
import FeeTemplateSelect from "./FeeTemplateSelect";





interface FormValues {
    start_date: string;
    end_date: string;
    resumption_date: string;
    active: boolean
   };



const CreateInvoice = ( props:any) => {

  const [feeItems, setFeeItems] = useState([]) 
  const [required_item, setrequired_item] = useState([])
  const [optional_item, setoptional_item] = useState([])
  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
  const {data, isSuccess, status, refetch} = useQuery('feeitems', ()=> getFeeItems(props.user_session.access_token), {enabled: false})

  useEffect(()=>{
    if(props.user_session_status == 'authenticated') {
      refetch()
    }
  }, [props.user_session_status=='authenticated'])

  useEffect(()=>{
    let refinedSeeItems: any = []
    if(data){
      data.data?.forEach((itm: any) =>{
        itm.value = itm .id 
        itm.label = itm.name
        refinedSeeItems.push(itm)
      })
    }
    setFeeItems(refinedSeeItems)
  }, [data])
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation(
    (data) =>
      createInvoice(props.user_session.access_token, data),
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
    mutate(tempData)
  }
  return (
    <div  className="">
      <form className="space-y-5"   onSubmit={handleSubmit(onSubmit)}>
        <h1>Generate Invoice</h1>
        <div>
          <ClassSelect register={register} setSelectedClass={(x: any)=>x} user_session={props.user_session} triggerFetch= {props.user_session_status == 'authenticated'} class_selector='class_id' />
        </div>
        <div>
          <FeeTemplateSelect register={register} user_session_status={props.user_session_status} user_session={props.user_session} />
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

export default CreateInvoice