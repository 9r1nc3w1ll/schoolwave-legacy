
export const createExams= async(  access_token: any, data: any)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/examexams/' , {
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
  
  export const editExam= async(id: string, access_token: string, data: any)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/examexams/' + id, {
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
  
  export const deleteExam= async (id: string, access_token: string)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/examexams/' + id, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token, 
      },
    
    })
   
   
    
    return res
  }
  
  
  export const getExams= async (access_token: any)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/examexams/' , {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token, 
      }
    })
    let tempData= await res.json()
    
    console.log("Here is our data", tempData.data)
    
    return tempData.data
  }

  export const getSingleExam= async (id: any, access_token?: string)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/examexams/' +id , {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token, 
      }
    })
    let tempData= await res.json()
   
    
    return tempData.data
  }
  
  
  
export const createExamQuestion= async(access_token: string, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/examquestions/' , {
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
  
export const getExamsQuestions= async (access_token: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/examquestions/' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
  
 
  
  return tempData.data
}