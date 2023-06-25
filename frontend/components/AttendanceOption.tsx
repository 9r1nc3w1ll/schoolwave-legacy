import { useState } from "react";
import Dropdown from "./Dropdown";
import useComponentVisible from "@/hooks/useComponentVisible";




export default function AttendanceOption(){
  const [showOptions, setShowOptions] = useState(false)
  const { ref, isComponentVisible } = useComponentVisible(true);

  return(
    <div className="flex gap-1">
      <input type='checkbox' />
      <div className="relative z-[0]">
        <div onClick={()=>{
          setShowOptions(!showOptions)
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4 z-[0]" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
          </svg>
        </div>

        { showOptions && isComponentVisible &&  <ul ref={ref} className="absolute left-0 top-0 mt-5 z-[20000]  bg-white shadow p-2 text-sm">
          <li>-- choose a remark --</li>
          <li>Unexcused</li>
          <li>Excused</li>
          <li>Late</li>
          <li>Punctual</li>
        </ul>}
      </div>

    </div>
  )
}