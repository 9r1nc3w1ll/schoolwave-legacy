interface Staff {
  
    username: string,
    password: string,
    first_name : string,
    last_name: string,
    title: string,
    roles : string[]
    
}


export const getAllStaffs= async (access_token?: string)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/staff/staff-list' , {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token, 
      }
    })
    let tempData= await res.json()
   
    
    return tempData.data
  }


  // /staff/staff-list
  
  export const CreateStaff = async (access_token: string, data:Staff) =>{
    
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/staff/staff-list', {
        method: "POST",
        headers:{
          "content-Type": "application/json",
          "Authorization": 'Bearer' + access_token
        },
        body: JSON.stringify(data)
    });

    return await res.json()

  }

  export const EditStaff = async (id:string, access_token: string, data:Staff) =>{
    
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/staff/staff-list' + id, {
        method: "PATCH",
        headers:{
          "content-Type": "application/json",
          "Authorization": 'Bearer' + access_token
        },
        body: JSON.stringify(data)
    });
    
    return await res.json()

  }