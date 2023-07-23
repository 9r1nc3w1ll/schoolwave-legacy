import AnimateHeight from 'react-animate-height';
import { useEffect, useState } from 'react';
import AttendanceTablet from './AttendanceTablet';


const AttendanceAccordion =(props: any)=>{
  const [search, setSearch] = useState<string>('');
  const [userID, setuserId] = useState([]);
  const [userATT, setuserATT] = useState([]);
  const [filteredItems, setFilteredItems] = useState<any>(props.attendance? props.attendance.students: props.students);

  const initAttendance =()=>{
    let attnd= []
    if(userID.length < 1 && userATT.length < 1){
      props.attendance.forEach(att =>{attnd.push(att)})
    }
  }

  useEffect(() => {
    setFilteredItems(() => {
      if(props.attendance){
        
        return props.attendance?.students.filter((item: any) => {
          return item.first_name.toLowerCase().includes(search.toLowerCase()) || item.last_name.toLowerCase().includes(search.toLowerCase());
        });
      }else{
        return props.students?.filter((item: any) => {
          return item.first_name.toLowerCase().includes(search.toLowerCase()) || item.last_name.toLowerCase().includes(search.toLowerCase());
        });
      }
    });
  }, [search]);

  if(props.attendance){

    return(
      <div className="mb-5">
        <div className=" font-semibold">
     
            
          <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]  ">
            <div className={`md:flex justify-between ${props.active === props.i? 'p-5': ''}`}>
  
              <h1
          
                className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] `}
                onClick={() => props.togglePara(props.i)}
              >
                {props.attendance.date}
            
              </h1>
  
              {props.active === props.i &&   <input
                type="text"
                value={search}
                placeholder="Search Students..."
                className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] lg:w-1/3 bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                onChange={(e) => setSearch(e.target.value)}
              />}
            </div>
            <div>
              <AnimateHeight duration={300} height={props.active === props.i ? 'auto' : 0}>
                <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]  flex gap-2 flex-wrap">
                  { filteredItems.map((student: any, j: number) => <AttendanceTablet key={j}  user={student}  />)}
                </div>
              </AnimateHeight>
            </div>
          </div>
    
        </div>
      </div>
    )
  }else{
    return(
      <div className="mb-5">
        <div className=" font-semibold">
     
            
          <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]  ">
            <div className={`md:flex justify-between ${props.active === props.i? 'p-5': ''}`}>
  
              <h1
          
                className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] `}
                onClick={() => props.togglePara(props.i)}
              >
                {props.today}
            
              </h1>
  
              {props.active === props.i &&   <input
                type="text"
                value={search}
                placeholder="Search Students..."
                className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] lg:w-1/3 bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                onChange={(e) => setSearch(e.target.value)}
              />}
            </div>
            <div>
              <AnimateHeight duration={300} height={props.active === props.i ? 'auto' : 0}>
                <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]  flex gap-2 flex-wrap">
                  { filteredItems.map((student: any, j: number) =>{ 
                    student.present = false
                    student. remark = ''
                    return <AttendanceTablet key={j}  user={student}  />})}
                </div>
                <button className='btn btn-primary' >Save</button>
              </AnimateHeight>
            </div>
          </div>
    
        </div>
      </div>
    )
  }

}

export default AttendanceAccordion
