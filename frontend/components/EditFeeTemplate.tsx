import { useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { editSession } from '@/apicalls/session';
import { editFeeItem } from '@/apicalls/fees';
import DiscountSelect from './DiscountSelect';
import ClassSelect from './ClassSelect';
import Select from 'react-select/dist/declarations/src/Select';





interface FormValues {
    start_date: string;
    end_date: string;
    resumption_date: string;
   };



const EditFeeItem = (props:any) => {

  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
 
  const queryClient = useQueryClient();
  useEffect(()=>{
    reset(props.sessionData)
  },[])

  const { mutate, isLoading, error } = useMutation(
    (data) => editFeeItem(props.sessionData.id, props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Session Edited Successfuly')
        props.refreshSession()
        props.exit(false)
        
  
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




  const onSubmit = async (data: any) => { 

    mutate(data); };
  return (
    <div  className="">
      <form className="space-y-5"   onSubmit={handleSubmit(onSubmit)}>
      
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text"  className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <ClassSelect register={register} setSelectedClass={(x: any)=>x} user_session={props.user_session} triggerFetch= {props.user_session_status == 'authenticated'} class_selector='class_id' />
        </div>
        <div>
          <DiscountSelect register={register} trigger={props.user_session_status == 'authenticated'} user_session={props.user_session} />
        </div>
        <div>
          <label htmlFor="name">Required Fee Items</label>
          <Select  placeholder="Select an option" options={[]} isMulti isSearchable={true} onChange={(e:any)=>{
            let dataofInterest: any = []
            e.forEach((itm: any) =>{dataofInterest.push(itm.id)})
            // setrequired_item(dataofInterest)
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

export default EditFeeItem;