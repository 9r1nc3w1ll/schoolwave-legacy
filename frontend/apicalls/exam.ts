export const BulkSubjectsUpload= async (data:any, access_token ?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/subject/batch_upload_requests' , {
    method: "POST",
    body: data,
    headers: {
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
   
   
  return tempData
}


export const createExams= async(  access_token: any, data: any)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/exam/exams' , {
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
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/exam/exams' + id, {
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
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/exam/exams' , {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token, 
      }
    })
    let tempData= await res.json()
    
    
    
    return tempData.data
  }

  export const getSingleExam= async (id: any, access_token?: any)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/exam/exams/'+id  , {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token, 
      }
    })
    let tempData= await res.json()
 
    
    return tempData.data

  }
  
  
  
export const createExamQuestion= async(access_token: any, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/exam/questions' , {
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
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/exam/questions' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
  
 
  
  return tempData.data
}

export const editExamQuestion= async(id: string, access_token: string, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/examquestions/' + id+'/', {
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




export const deleteExamQuestion= async (id: string, access_token: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/examquestions/' + id +'/', {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
  
  })
 
 
  
  return res
}