import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import {useEffect, useState} from 'react'
import { setPageTitle } from "@/store/themeConfigSlice";
import { useMutation, useQuery } from "react-query";
import { getStudents } from "@/apicalls/users";
import AttendanceTablet from "@/components/AttendanceTablet";
import Tippy from "@tippyjs/react";
import AttendanceTable from "@/components/AttendanceTable";
import { getClasses } from "@/apicalls/clas";
import { getTerms } from "@/apicalls/session";
import { getAttendance } from "@/apicalls/attendance";
import { useForm } from "react-hook-form";
import { showAlert } from "@/utility_methods/alert";
import AttendanceModal from "@/components/AttendanceModal";



const Attendance =()=>{
  const dispatch = useDispatch();
  const [listView, setListView] = useState(false)
  const [students, setStudents] = useState()
  const [rqstAtt, setrqstAtt] = useState(false)
  const [today, settoday] = useState(false)
  const [attendanceEmpty, setattendanceEmpty] = useState(false)
  const [attData, setattData] = useState({})
  const { status: sessionStatus, data: user_session } = useSession();
  const { data: studentList, isSuccess,isLoading, refetch:getstudents } = useQuery('getStudents', () => {
    return getStudents(user_session?.access_token)
  }, {
    enabled: false
  })

  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });

  const { data: classes, isSuccess:classgotten,  refetch:getclasses } = useQuery('getClasses', () => {
    return getClasses(user_session?.access_token)
  }, {
    enabled: false
  })

  const { data: terms, isSuccess:termgotten,  refetch:getterms } = useQuery('getTerms', () => {
    return getTerms(user_session?.access_token)
  }, {
    enabled: false
  })

  const { mutate, data: attendance,  isLoading:loadingattendance, isSuccess:attendancegotten, error } = useMutation(
    (data) =>
      getAttendance(data, user_session?.access_token),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Saved Successfuly')
      

      },
      onError: (error:any) => {
                 
        showAlert('error', 'An Error Occured' )
        
      }
    }
  );



  useEffect(() => {
    dispatch(setPageTitle('Schoolwave | Attendance'));
    // getAttendance()
    setrqstAtt(true)
  }, []);



  useEffect(() => {
    setStudents(studentList)
  }, [attendanceEmpty, studentList, getstudents]);

  useEffect(() => {
    if(sessionStatus == 'authenticated'){
      // getstudents()
      getclasses()
      getterms()
    }

  }, [getclasses, getstudents, getterms, sessionStatus]);
  const presentday = new Date().toISOString().substring(0,10)

  const onSubmit =(data: any)=>{
    let tday = presentday === data.startDate
    data.today = tday
    settoday(tday)
    mutate(data)
   
  }
 

  const [active, setActive] = useState<string>('0');
  const togglePara = (value: string) => {
    setActive((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };
  

  return(
   
    <div className="panel min-h-[70%] ">
      <div className="mb-4 flex justify-between">
        <div>
          <h1 className=" text-3xl font-semibold dark:text-white-light">Attendance</h1>
          <p className="text-xs"> * Leave start date and end date as it is to get today&apos;s attendance</p>
        </div>
        {/* <input type="text" className="form-input w-auto" placeholder="Search..."
           value={search} onChange={(e) => setSearch(e.target.value)}
        /> */}
        <div className="flex gap-2">
          <svg onClick={()=>{setListView(true)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${listView? "text-primary":''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
          </svg>

          <svg onClick={()=>{setListView(false)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${!listView? "text-primary":''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>

        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-6">
          <div>
            <div className="mb-8">
              <label>Class</label>
              <select className="form-select text-white-dark" id='class' {...register("class", { required: "This field is required" })} >
                <option>-- select One-- </option>
                {classes?.map((clss: any)=> <option key={clss.id} value={clss.id}> {clss.name} </option>)}
              </select>
            </div>
           
            <div>
              <label>Term</label>
              <select className="form-select text-white-dark" id='term' {...register("term", { required: "This field is required" })} >
                <option>-- select One-- </option>
                {terms?.map((trm: any)=> <option key={trm.id} value={trm.id}>  {trm.name} </option>)}
              </select>
            </div>

            <button className="btn btn-primary mt-4" type='submit'>Update</button>
          </div>
          <div className=" ">
            <div className="mb-8">
              <label>Start Date</label>
              <input type="date" placeholder="Choose a day" className="form-input" defaultValue={presentday} id='startDate'  {...register("startDate", { required: "This field is required" })}  />
            </div>
            <div>
              <label>End Date</label>
              <input type="date" placeholder="Choose a day" className="form-input" defaultValue={presentday} id='endDate' {...register("endDate", { required: "This field is required" })} />
            </div> 
          
          </div>
            
        </div>
      </form>

      <hr/>
      {
        listView?
          <>
            {
              attendancegotten && attendance?.length?
                
                ( <AttendanceTable user={ attendance[0]?.attendance}  />):

                <h1> {isLoading? 'Loading...': 'No data to display, adjust the filters and click update to fetch data' }</h1>
            }
        
          </>
     
          :
          <>

            <h1 className=" mt-6 text-xl font-semibold dark:text-white-light">Today</h1>
            <div className="w-full">

              {
                attendancegotten && attendance?.length ?
                
                  attendance[0]?.attendance.map((student: { id: any; }, i: number) => {
                 
                    return <AttendanceModal key={student.id} attendance={student}  i={`${i}`} togglePara={togglePara} active={active} />
                  }):

                  <h1> {loadingattendance? 'Loading...': 'No data to display, adjust the filters and click update to fetch data' }</h1>
              }
            
            </div>
          </>
      }
    </div>
 
  )
}

export default Attendance