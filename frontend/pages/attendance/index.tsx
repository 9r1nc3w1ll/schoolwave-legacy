import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import {useEffect, useState} from 'react'
import { setPageTitle } from "@/store/themeConfigSlice";
import { useQuery } from "react-query";
import { getStudents } from "@/apicalls/users";
import AttendanceTablet from "@/components/AttendanceTablet";
import Tippy from "@tippyjs/react";
import AttendanceTable from "@/components/AttendanceTable";

const tableData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@yahoo.com',
    date: '10/08/2020',
    sale: 120,
    status: 'Complete',
    register: '5 min ago',
    progress: '40%',
    position: 'Developer',
    office: 'London',
  },
  {
    id: 2,
    name: 'Shaun Park',
    email: 'shaunpark@gmail.com',
    date: '11/08/2020',
    sale: 400,
    status: 'Pending',
    register: '11 min ago',
    progress: '23%',
    position: 'Designer',
    office: 'New York',
  },
  {
    id: 3,
    name: 'Alma Clarke',
    email: 'alma@gmail.com',
    date: '12/02/2020',
    sale: 310,
    status: 'In Progress',
    register: '1 hour ago',
    progress: '80%',
    position: 'Accountant',
    office: 'Amazon',
  },
  {
    id: 4,
    name: 'Vincent Carpenter',
    email: 'vincent@gmail.com',
    date: '13/08/2020',
    sale: 100,
    status: 'Canceled',
    register: '1 day ago',
    progress: '60%',
    position: 'Data Scientist',
    office: 'Canada',
  },
];

const Attendance =()=>{
  const dispatch = useDispatch();
  const [listView, setListView] = useState(false)
  const { status: sessionStatus, data: user_session } = useSession();
  const { data: students, isSuccess, status, refetch } = useQuery('getStudents', () => {
    return getStudents(user_session?.access_token)
  }, {
    enabled: false
  })


  useEffect(() => {
    dispatch(setPageTitle('Schoolwave | Attendance'));

  }, []);

  useEffect(() => {
    if(sessionStatus == 'authenticated'){
      refetch()
    }

  }, [sessionStatus]);


  return(
   
    <div className="panel min-h-[70%] ">
      <div className="mb-4 flex justify-between">
        <h1 className=" text-3xl font-semibold dark:text-white-light">Attendance</h1>
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
      <form>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-6">
          <div>
            <select className="form-select text-white-dark">
              <option>Class</option>
              <option>Basic 1 Jade</option>
              <option>Basic 1 Gold</option>
              <option>Basic 2</option>
            </select>
          </div>
           
          <div>
            <select className="form-select text-white-dark">
              <option>Term</option>
              <option>1st Term</option>
              <option>2nd Term</option>
              <option>3rd Term</option>
            </select>
          </div>


          { listView? <div>
            <select className="form-select text-white-dark">
              <option>week</option>
              <option>Week 1</option>
              <option>Week 2</option>
              <option>Week 3</option>
              <option>Week 4</option>
              <option>Week 5</option>
              <option>Week 6</option>
              <option>Week 7</option>
              <option>Week 8</option>
              <option>Week 9</option>
              <option>Week 10</option>
              <option>Week 11</option>
              <option>Week 12</option>
              <option>Week 13</option>
            </select>
          </div>
            :
            <input type="date" placeholder="Choose a day" className="form-input" />}
        </div>
      </form>

      <hr/>
      {
        listView?
          <AttendanceTable />
          :
          <>

            <h1 className=" mt-6 text-xl font-semibold dark:text-white-light">Today</h1>
            <div className="mt-2 flex gap-2 flex-wrap">
              {
                isSuccess && students?.map((student: { id: any; }) => <AttendanceTablet key={student.id} user={student}  />)
              }
            
            </div>
          </>
      }
    </div>
 
  )
}

export default Attendance