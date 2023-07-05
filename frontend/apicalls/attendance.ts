const x = 
  [
    {
   
      "class_info": "Basic i Jade",
      "staff_info": "Bamidele Aji",
      "class_id": "1c69ce0b-6304-45be-905f-bbaa9010db35",
      "subject": "",
      "staff": "71fa9e00-6889-4b90-81e4-94c6ccf3fa9f",
      "created_at": "2023-07-05T00:36:26.851258Z",
      "updated_at": "2023-07-05T00:36:26.851258Z",
      "deleted_at": null,
      "attendance_type": "Daily",
      "attendance": [
        {
          "date": "2023-07-05",
          "id":  "9aa9e68a-ba23-4885-9141-71b10c9214e",
          "students": [
            {
              "first_name": "Akpos",
              "last_name": "Egobe",
              "present": true,
              "remark": "Excused"
            },
            {
              "first_name": "Akpos1",
              "last_name": "Eg2obe",
              "present": true,
              "remark": "Excused"
            },
            {
              "first_name": "Akpos",
              "last_name": "Egobe",
              "present": true,
              "remark": "Excused"
            }
          ]
        },
        {
          "date": "2023-07-07",
          "id":  "9aa9e68a-ba23-4885-9141-71b1c92143e",
          "students": [
            {
              "first_name": "Akpos",
              "last_name": "Egobe",
              "present": true,
              "remark": "Excused"
            },
            {
              "first_name": "Akpos1",
              "last_name": "Eg2obe",
              "present": true,
              "remark": "Excused"
            },
            {
              "first_name": "Akpos",
              "last_name": "Egobe",
              "present": true,
              "remark": "Excused"
            }
          ]
        },
        {
          "date": "2023-07-08",
          "id":  "9aa9e68a-ba23-4885-141-71b10c92143e",
          "students": [
            {
              "first_name": "Akpos",
              "last_name": "Egobe",
              "present": true,
              "remark": "Excused"
            },
            {
              "first_name": "Akpos1",
              "last_name": "Eg2obe",
              "present": true,
              "remark": "Excused"
            },
            {
              "first_name": "Akpos",
              "last_name": "Egobe",
              "present": true,
              "remark": "Excused"
            }
          ]
        },
        {
          "date": "2023-07-09",
          "id":  "9aa9e68a-ba3-4885-9141-71b10c92143e",
          "students": [
            {
              "first_name": "Akpos",
              "last_name": "Egobe",
              "present": true,
              "remark": "Excused"
            },
            {
              "first_name": "Akpos1",
              "last_name": "Eg2obe",
              "present": true,
              "remark": "Excused"
            },
            {
              "first_name": "Akpos",
              "last_name": "Egobe",
              "present": true,
              "remark": "Excused"
            }
          ]
        }
      ]
      
         
    }
  ]
export const getAttendance= async (data: any, access_token?: string)=>{
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/attendance/student-attendance/${data?.class}${data?.today? '': `/${ data?.startDate}/${data?.endDate}`}` , {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": 'Bearer '+ access_token, 
    }
  })
  let tempData= await res.json()
  
  // return []


  return x
}
  