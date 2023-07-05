
export const getAttendance= async (data: any, access_token?: string)=>{
  console.log(access_token)
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/attendance/student-attendance/${data?.class}${data?.today? '': `/${ data?.startDate}/${data?.endDate}`}` , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
  
  // return []
  return tempData.data
}
  