export const getStudents= async (access_token: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/account/users' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let u= await res.json()
   
  let students = u.data.filter((x:any)=> x.role == 'student')
  return students
}


export const getStdnt= async (access_token: string, id: any)=>{

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/users/${id.id}` , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let u= await res.json()
   

  return u.data
}

export const EditUser= async (access_token: string, data: any, id: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/account/users/' + id.id , {
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