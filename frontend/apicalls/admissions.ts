export const BulkAdmissionUpload= async (data:any, access_token ?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/admission/batch_upload_requests' , {
    method: "POST",
    body: data,
    headers: {
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
   
   
  return tempData
}

export const createAdmission= async ( data : any, access_token?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/admission/requests/create', {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
     
      
  return tempData.data
}
    


export const getAdmissions= async (access_token?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/admission/requests' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
   
    
  return tempData.data
}
  
export const updateAdmission= async (id: string, approve : boolean, access_token?: string)=>{
  const bdy: any= {}
  bdy.status = approve?"approved":"denied"
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/admission/requests/' + id , {
    method: "PATCH",
    body: JSON.stringify(bdy),
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
     
      
  return tempData.data
}
    
