

import axios from "axios"

export const createSession= async(access_token, data)=>{
  const x = axios.post('http://127.0.0.1:8000/session/session', data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    
      
    },
  })
return x
}

export const editSession= async(id, access_token, data)=>{
  const x =axios.patch('http://127.0.0.1:8000/session/session/'+ id, data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
  })
  return x
}

export const deleteSession= async (id, access_token)=>{
  const x = await axios.delete('http://127.0.0.1:8000/session/session/'+ id,  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
            
              
    },
  })

  

  return  x
}


export const getSession= async (access_token)=>{

   
  const x = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session',{
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
      
        
    },
  })

  return x.data
}

