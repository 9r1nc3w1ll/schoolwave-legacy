import { useEffect, useState } from "react";
import Image from "next/image";

const StaffAttendance = (props: any) => {
  const [staffData, setStaffData] = useState<any>([])
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchStaffData = () => {
      try {
        fetch('https://jsonplaceholder.typicode.com/users/', {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        }).then(res => res.json())
          .then(data => setStaffData(data))
      } catch (err) {
        console.log(err);
      }
    }
    fetchStaffData()
  }, [staffData]);
  

  useEffect(() => {
    setStaffData(() => {
      return staffData.filter((staff: any) => {
        return staff.name.toLowerCase().includes(search.toLowerCase()) || staff.email.toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [search, staffData]);

  return (
    <div className="p-2">
      <h1 className="font-bold text-2xl mb-10">Staff Attendance</h1>
      <div className="flex flex-row items-center justify-around">
        <input
          type="text"
          value={search}
          placeholder="Search Staffs..."
          className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" className="btn btn-primary relative ml-[-40px] mr-[4px] inset-y-0 rounded-full w-9 h-9 p-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </div>

      <div className='grid grid-cols-4 gap-6 my-10'>
        {staffData.map((staff: any) => (
          <div key={staff.id}>
            <div className="mb-5 flex">
              <div className="max-w-[19rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                <div className="py-7 px-6">
                  <div className="-mt-7 mb-7 -mx-6 rounded-tl rounded-tr h-[215px] overflow-hidden">
                    <Image src="/assets/images/profile-28.jpeg" alt="cover" className="w-full h-full object-cover" width={500} height={500} />
                  </div>
                  <h5 className="text-[#3b3f5c] text-xl font-semibold mb-4 dark:text-white-light">{staff.name}</h5>
                  <p className="text-white-dark">{staff.email}</p>
                  <p className="text-white-dark">{staff.phone}</p>
                </div>
                <div className='border-t border-white-light dark:border-[#1b2e4b] py-2'>
                  <div className="flex flex-row justify-between items-center px-6">
                    <p className='text-lg'>Clock In</p>
                    <input id="tack_checkbox1" type="checkbox" className="form-checkbox" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffAttendance;
