
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