 
import {useState} from 'react'
 
const CheckboxWithState= (props: any)=>{

  const [selected, setSelectted]= useState(false)
  return(
    <input type='checkbox' checked={selected}  onChange={()=>{setSelectted(!selected)}} onClick={()=>{
      props.click()
    }} />
  )
}
  
export default  CheckboxWithState