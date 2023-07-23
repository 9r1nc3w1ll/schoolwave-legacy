
export const getAttendance= async (data: any, access_token?: string)=>{

  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/attendance/student-attendance/${data?.class}/${ data?.startDate}/${data?.endDate}` , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
  
  return tempData.data
}
  


export const markAttendance= async (data: any, access_token?: string)=>{

  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/attendance/student-attendance/${data?.class}/${ data?.startDate}/${data?.endDate}` , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
  
  return tempData.data
}

export const markBulkAttendance= async (data: any, access_token?: string)=>{

  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/attendance/student-attendance/create' , {
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
    let msg= 'An error occured'
    if(tempData.message.split(' ')[tempData.message.split(' ').length - 1] == 'exists.'){
      msg = "Class with class Code already exists"
    }
 
    return {
      error:true,
      message: msg
    }
  }
}