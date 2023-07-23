import { useEffect, useState } from "react"


export default function AttendanceTablet (props: any){
  const [present, setpresent] = useState(props.user.present)
  const [remark, setremark] = useState(props.user.remark)

  useEffect(()=>{
    props.handleChange(props.key, remark, present )
  }, [present, remark])

  return(
    <form className={`max-w-[220px] bg-${props.user.present? 'primary': 'black'}-light shadow-md p-2 rounded-sm hover:shadow-sm`}>
      <div className="flex gap-2 mb-2">
        <input type='checkbox' className="" checked={present} onChange={()=>{
          setpresent(!present)
        }}/>
        <h1>{props.user.first_name + ' ' + props.user.last_name }  </h1>
      </div>
      <div>
        <select className="form-select text-white-dark" value={remark} onChange={(e)=>{
          setremark(e.target.value)
          
          }}>
          <option>Remark</option>
          <option>Unexcused</option>
          <option>Excused</option>
          <option>Absent</option>
          <option>Late</option>
          <option>Punctual</option>
        </select>
      </div>
    </form>

  )
}