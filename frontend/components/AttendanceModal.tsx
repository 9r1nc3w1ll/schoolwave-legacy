import AnimateHeight from 'react-animate-height';
import { useState } from 'react';
import AttendanceTablet from './AttendanceTablet';


const AttendanceModal =(props: any)=>{



  return(
    <div className="mb-5">
      <div className=" font-semibold">
   
          
        <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
          <h1
        
            className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] `}
            onClick={() => props.togglePara(props.i)}
          >
            {props.attendance.date}
          
          </h1>
          <div>
            <AnimateHeight duration={300} height={props.active === props.i ? 'auto' : 0}>
              <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]  flex gap-2 flex-wrap">
                { props.attendance.students.map((student: any, j: number) => <AttendanceTablet key={j}  user={student}  />)}
              </div>
            </AnimateHeight>
          </div>
        </div>
  
      </div>
    </div>
  )
}

export default AttendanceModal
