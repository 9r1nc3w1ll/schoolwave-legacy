
export const createSession= async(access_token: string, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session' , {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
    body: JSON.stringify(data),
  })
  let tempData= await res.json()
 
  
  return tempData
}

export const editSession= async(id: string, access_token: string, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session/' + id, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
    body: JSON.stringify(data),
  })
  let tempData= await res.json()
 
  
  return tempData
}

export const deleteSession= async (id: string, access_token: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session/' + id, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
  
  })
 
 
  
  return res
}


export const getSession= async (access_token: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
 
  
  return tempData
}
