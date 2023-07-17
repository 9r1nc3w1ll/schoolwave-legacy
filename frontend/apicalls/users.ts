export const getStudents= async (access_token: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/account/users' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
   
  let students = tempData.data.filter((x:any)=> x.role == 'student')
  return students
}

export const getStaffs= async (access_token ?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/account/users' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token , 
    }
  })
  let tempData= await res.json()
   
  let staffs = tempData.data.filter((x:any)=> x.is_staff )
  return staffs
}

export const getAllUsers= async (access_token ?: string)=>{

  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/account/users' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token , 
    }
  })
  let tempData= await res.json()
  
  return tempData
}


export const getParents= async (access_token ?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/account/users' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token , 
    }
  })
  let tempData= await res.json()
   
  let parents = tempData.data.filter((x:any)=> x.role == 'parent' )
  return parents
}

export const getUser= async (access_token: any, id: any)=>{

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/users/${id.id}` , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
   

  return tempData.data
}

export const EditUser= async (access_token: any, data: any, id: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/account/users/' + id.id , {
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


export const createUser= async ( data: any, access_token ?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/account/users', {
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