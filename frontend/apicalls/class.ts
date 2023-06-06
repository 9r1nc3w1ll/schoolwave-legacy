

import axios from "axios"

export const createClass= async(access_token, data)=>{
  const x = axios.post('http://127.0.0.1:8000/school/class', data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    
      
    },
  })
return x
}

export const editClass= async(id, access_token, data)=>{
  const x =axios.patch('http://127.0.0.1:8000/school/class/'+ id, data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
  })
  return x
}

export const deleteClass= async (id, access_token)=>{
  const x = await axios.delete('http://127.0.0.1:8000/school/class/'+ id,  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
            
              
    },
  })

  

  return  x
}


export const getClass= async (access_token)=>{

   
  const x = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class',{
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
      
        
    },
  })

  return x.data
}

export const getClasses= async (access_token)=>{

   
    const x = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class',{
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token, 
        
          
      },
    })
  
    return x.data
  }
