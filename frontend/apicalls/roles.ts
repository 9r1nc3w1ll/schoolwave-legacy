

export const getRoles= async (access_token: string)=>{

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/staff-role-list` , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let u= await res.json()
     
  
  return u.data
}
  