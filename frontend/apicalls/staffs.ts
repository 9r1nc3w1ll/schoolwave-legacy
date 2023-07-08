

export const getAllStaffs= async (access_token?: string)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/staff/staff-list' , {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token, 
      }
    })
    let tempData= await res.json()
   
    
    return tempData
  }


  
  