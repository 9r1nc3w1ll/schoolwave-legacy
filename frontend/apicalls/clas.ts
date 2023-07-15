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
  if(res.ok){
    return tempData

  }else{
    return {
      error:true
    }
  }
  
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
  if(res.ok){
    return tempData

  }else{
    return {
      error:true
    }
  }
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





export const getClasses= async (access_token?: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()

 
  return tempData.data
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



export const getClassStudents= async ( id : any, access_token?: string )=>{
  console.log('rhg id', id)
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class-member/'+id , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()

  return tempData.data.filter((student :{role: string} )=> student.role ==='student')
}

export const getClassStaffs= async ( id : any, access_token?: string )=>{

  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class-member/'+id , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()

  return tempData.data.filter((staff :{role: string} )=> staff.role !='student')
}





export const AssignUserToClass= async(data: any, access_token?: string)=>{

  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/school/class-member' , {
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