export const CreateLesssonNote= async ( data: any, access_token ?: string)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/lessonnotes/lesson-note-list', {
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

  export const getLesssonNote= async (access_token?:string)=>{
    
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/lessonnotes/lesson-note-list', {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token,
     
      }
   
     
    })
    let tempData= await res.json()
  
  
    return tempData.data
  }

 
  

  export const editLessonNote= async(id: string, access_token: any, data: any)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/lessonnotes/lesson-note-detail/' + id, {
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
  

  export const deleteLessonNote= async (id: string, access_token: any)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/lessonnotes/lesson-note-detail/' + id, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token, 
        
      },
    
    })

    return res 
    
  }
  

  export const getSingleLesson= async (id: any, access_token?: string)=>{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/lessonnotes/lesson-note-detail/' +id , {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": 'Bearer '+ access_token, 
      }
    })
    let tempData= await res.json()
   
    
    return tempData.data
  }