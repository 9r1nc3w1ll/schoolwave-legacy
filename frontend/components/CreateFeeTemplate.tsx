import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { createSession } from '@/apicalls/session';
import {useEffect, useState} from 'react'
import { createFeeItem, getFeeItems } from "@/apicalls/fees";
import Select from 'react-select';
import ClassSelect from "./ClassSelect";





interface FormValues {
    start_date: string;
    end_date: string;
    resumption_date: string;
    active: boolean
   };



const CreateFeeTemplate = ( props:any) => {

  const [feeItems, setFeeItems] = useState([]) 
  const [required_item, setrequired_item] = useState([])
  const [optional_item, setoptional_item] = useState([])
  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
  const {data, isSuccess, status, refetch} = useQuery('feeitems', ()=> getFeeItems(props.user_session?.access_token))

  useEffect(()=>{
    let refinedSeeItems: any = []
    if(data){
      data.data?.forEach(itm =>{
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
    tempData.required_item = required_item
    tempData.optional_item = optional_item
    console.log(tempData);                                                                  
  };
  return (
    <div  className="">
      <form className="space-y-5"   onSubmit={handleSubmit(onSubmit)}>
      
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text"  className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name">Description</label>
          <ClassSelect register={register} setSelectedClass={(x)=>x} user_session={props.user_session} triggerFetch= {props.User_session_status == 'authenticated'} />
        </div>
        <div>
          <label htmlFor="name">Required Fee Items</label>
          <Select  placeholder="Select an option" options={feeItems} isMulti isSearchable={true} onChange={(e:any)=>{
            let dataofInterest: any = []
            e.forEach((itm: any) =>{dataofInterest.push(itm.id)})
            setrequired_item(dataofInterest)
          }} />
        </div>
        <div>
          <label htmlFor="name">Optional Fee Items</label>
          <Select  placeholder="Select an option" options={feeItems} isMulti isSearchable={true} onChange={(e:any)=>{
            let dataofInterest: any = []
            e.forEach((itm: any) =>{dataofInterest.push(itm.id)})
            setoptional_item(dataofInterest)
          }} />
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

export default CreateFeeTemplate;