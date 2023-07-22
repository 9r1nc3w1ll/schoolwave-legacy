import { getFeeTemplates } from "@/apicalls/fees"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"


const FeeTemplateSelect =(props: any)=>{
  const [discounts, setDiscount] = useState([])
  const {data, isLoading,  refetch} = useQuery('feetemplatess', ()=> getFeeTemplates(props.user_session.access_token), {enabled: false})

  useEffect(()=>{
    if(props.user_session_status == 'authenticated'){

      refetch()
    }
  },[props.user_session_status == 'authenticated'])

  useEffect(()=>{
    if(data){
      console.log(data.data)
      setDiscount(data.data)
    }
  },[data])

  return(
    <>
      <label>Fee Template</label>
      <select placeholder="Fee Template" className="form-input"  {...props.register("template")} 
        onClick={()=>{
          refetch()
        }}>
        <option>Discounts</option>
        {isLoading? <option>Loading ...</option>:
          discounts?.map((disc:any)=> <option key={disc.id} value={disc.id} >{disc.id}</option>)
        }
      </select>
    </>
  )
}

export default FeeTemplateSelect