
export const createSession= async(access_token: string, data: void)=>{
  const x = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session' , {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
    body: JSON.stringify(data),
  })
  let u= await x.json()
 
  
  return u
}

export const editSession= async(id: string, access_token: string, data: void)=>{
  const x = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session/' + id, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
    body: JSON.stringify(data),
  })
  let u= await x.json()
 
  
  return u
}

export const deleteSession= async (id: string, access_token: string)=>{
  const x = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session/' + id, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
  
  })
 
 
  
  return x
}


export const getSession= async (access_token: string)=>{
  const x = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let u= await x.json()
 
  
  return u
}
