export const createClass= async(data: any, access_token?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class' , {
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

export const editClass= async(id: string, access_token: string, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class/' + id, {
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





export const getClasses= async (access_token?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
 
  
  return tempData
}



export const getClass= async ( id : any, access_token?: string )=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class/'+id , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
 
  
  return tempData.data
}





export const AssignUserToClass= async(data: any, access_token?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class-user' , {
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