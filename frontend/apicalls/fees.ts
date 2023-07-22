
export const createFeeItem= async(access_token: string, data: any)=>{
 
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/fee_item' , {
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
  
export const editFeeItem= async(id: string, access_token: string, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/fee_item/' + id, {
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
  
export const deleteFeeItem= async (id: string, access_token: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/fee_item/' + id, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
    
  })
   
   
    
  return res
}
  
  
export const getFeeItems= async (access_token: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/fee_item' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
    
   
    
  return tempData
}
export const getSingleFeeItem= async (id: any, access_token?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/fee_item/' +id , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
   
    
  return tempData.data
}
  


export const createDiscount= async(access_token: string, data: any)=>{
 
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/discount' , {
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
    
export const editDiscount= async(id: string, access_token: string, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/discount/' + id, {
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
    
export const deleteDiscount= async (id: string, access_token: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/discount/' + id, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
      
  })
     
     
      
  return res
}
    
    
export const getDiscounts= async (access_token: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/discount' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
      
  return tempData.data
}
export const getSingleDiscount= async (id: any, access_token?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/discount/' +id , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
     
      
  return tempData.data
}
    


export const createFeeTemplate= async(access_token: string, data: any)=>{
 
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/fee_template' , {
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
    
export const editFeeTemplate= async(id: string, access_token: string, data: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/fee_template/' + id, {
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
    
export const deleteFeeTemplate= async (id: string, access_token: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/fee_template/' + id, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
      
  })
     
     
      
  return res
}
    
    
export const getFeeTemplates= async (access_token: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/fee_template' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
      
     
      
  return tempData
}
export const getSingleFeeTemplate= async (id: any, access_token?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/fee_template/' +id , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
     
      
  return tempData.data
}

export const getInvoices= async (access_token: any)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/invoice' , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
    
   
    
  return tempData
}

export const createInvoice= async(access_token: string, data: any)=>{
  const template = {
    template: data.template,
    items: ['9937acb1-f2ab-4555-a061-9417beb9fe7f']
  }
 
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/fees/invoice/bulk_create_invoice/'+ data.class_id , {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    },
    body: JSON.stringify(template),
  })
  let tempData= await res.json()
     
      
  return tempData
}
    