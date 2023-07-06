import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import 'tippy.js/dist/tippy.css';
import AttendanceOption from "./AttendanceOption";

const students =  [
  {
    "first_name": "Akpos",
    "last_name": "Egobe",
    "id": "a1"
  },
  {
    "first_name": "Akpos1",
    "last_name": "Eg2obe",
    "id": "a2"
  },
  {
    "first_name": "Akpos",
    "last_name": "Egobe",

    "id": "a3"
  }
]


const Tablex = (props:any)=>{
  // const [students, setStudents]= useState([])



  return (
    <div className="table-responsive mb-5">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            {
              props.attendance.map((att: any) =><th key={att.date}>{att.date}</th> )
            }
           
          </tr>
        </thead>
        <tbody>
          {students.map((data: any, i: number) => {
            // console.log('ppp', data)
            return (
              <tr key={data.id}>
                <td>
                  <div className="whitespace-nowrap">{data. first_name + ' ' + data.last_name}</div>
                </td>
                {
                  props.attendance.map((att: any) =><th key={att.date}> <AttendanceOption /></th> )
                }

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}
  
export default Tablex