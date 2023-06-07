export const createClass= async(access_token: string, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class' , {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
    body: JSON.stringify(data),
  })
  let u= await res.json()
 
  
  return u
}

export const editClass= async(id: string, access_token: string, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class/' + id, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
    body: JSON.stringify(data),
  })
  let u= await res.json()
 
  
  return u
}

export const deleteClass= async (id: string, access_token: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class/' + id, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
  
  })
 
 
  
  return res
}




export const getClasses= async (access_token: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let u= await res.json()
 
  
  return u
}
