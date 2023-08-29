import { getDiscounts } from "@/apicalls/fees"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"


const DiscountSelect =(props: any)=>{
  const [discounts, setDiscount] = useState([])
  const {data, isLoading,  refetch} = useQuery('feediscounts', ()=> getDiscounts(props.user_session?.access_token), {enabled: false})

  useEffect(()=>{
    if(props.trigger){

      refetch()
    }
  },[props.trigger])

  useEffect(()=>{
    if(data){
      setDiscount(data)
    }
  },[data])

  return(
    <select placeholder="Discount" className="form-input"  {...props.register("discount")} 
      onClick={()=>{
        refetch()
      }}>
      <option>Discounts</option>
      {isLoading? <option>Loading ...</option>:
        discounts.map((disc:any)=> <option key={disc.id} value={disc.id} >{disc.name}</option>)
      }
    </select>
  )
}

export default DiscountSelect