import AnimateHeight from 'react-animate-height';
import { useEffect, useState } from 'react';
import AttendanceTablet from './AttendanceTablet';
import { useMutation } from 'react-query';
import { showAlert } from '@/utility-methods/alert';
import { markBulkAttendance } from '@/api-calls/attendance';

const AttendanceAccordion = (props: any) => {
  const [search, setSearch] = useState<string>('');
  const [userID, setuserId] = useState([]);
  const [userATT, setuserATT] = useState([]);
  const [attRemarks, setAttRemarks] = useState([]);
  const [filteredItems, setFilteredItems] = useState<any>(
    props.attendance ? props.attendance.students : props.students
  );

  const { mutate, isLoading, error } = useMutation(
    (data: any) => {
      return markBulkAttendance(data, props.access_token);
    },
    {
      onSuccess: async (data) => {
        if (!data.error) {
          showAlert('success', 'Attendance saved successfuly');
        } else {
          showAlert('error', data.message);
        }
      },
      onError: (error) => {
        showAlert('error', 'An Error Occured');
      },
    }
  );

  const handleChange = (i: number, remarks: string, att: boolean) => {
    let attnd: any = userATT;
    let rmrks: any = attRemarks;
    attnd[i] = att;
    rmrks[i] = remarks;

    setuserATT(attnd);
    setAttRemarks(rmrks);
  };
  const initAttendance = () => {
    let attnd: any = [];
    let usr: any = [];
    let rmrks: any = [];
    if (userID.length < 1 && userATT.length < 1) {
      filteredItems.forEach((att: any) => {
        usr.push(att.user);
        attnd.push(false);
        rmrks.push('absent');
      });
    }
    setuserATT(attnd);
    setuserId(usr);
    setAttRemarks(rmrks);
  };

  useEffect(() => {
    setFilteredItems(() => {
      if (props.attendance) {
        return props.attendance?.students.filter((item: any) => {
          return (
            item.first_name.toLowerCase().includes(search.toLowerCase()) ||
            item.last_name.toLowerCase().includes(search.toLowerCase())
          );
        });
      } else {
        return props.students?.filter((item: any) => {
          return (
            item.first_name.toLowerCase().includes(search.toLowerCase()) ||
            item.last_name.toLowerCase().includes(search.toLowerCase())
          );
        });
      }
    });
  }, [search]);

  if (props.attendance) {
    return (
      <div className='mb-5'>
        <div className=' font-semibold'>
          <div className='rounded border border-[#d3d3d3] dark:border-[#1b2e4b]  '>
            <div
              className={`justify-between md:flex ${
                props.active === props.i ? 'p-5' : ''
              }`}
            >
              <h1
                className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] `}
                onClick={() => props.togglePara(props.i)}
              >
                {props.attendance.date}
              </h1>

              {props.active === props.i && (
                <input
                  type='text'
                  value={search}
                  placeholder='Search Students...'
                  className='form-input h-11 rounded-full bg-white shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] placeholder:tracking-wider ltr:pr-11 rtl:pl-11 lg:w-1/3'
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
            </div>
            <div>
              <AnimateHeight
                duration={300}
                height={props.active === props.i ? 'auto' : 0}
              >
                <div className='flex flex-wrap gap-2 space-y-2 border-t border-[#d3d3d3] p-4  text-[13px] text-white-dark dark:border-[#1b2e4b]'>
                  {filteredItems.map((student: any, j: number) => (
                    <AttendanceTablet key={j} user={student} />
                  ))}
                </div>
              </AnimateHeight>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='mb-5'>
        <div className=' font-semibold'>
          <div className='rounded border border-[#d3d3d3] dark:border-[#1b2e4b]  '>
            <div
              className={`justify-between md:flex ${
                props.active === props.i ? 'p-5' : ''
              }`}
            >
              <h1
                className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] `}
                onClick={() => {
                  initAttendance();
                  props.togglePara(props.i);
                }}
              >
                {props.today}
              </h1>

              {props.active === props.i && (
                <input
                  type='text'
                  value={search}
                  placeholder='Search Students...'
                  className='form-input h-11 rounded-full bg-white shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] placeholder:tracking-wider ltr:pr-11 rtl:pl-11 lg:w-1/3'
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
            </div>
            <div>
              <AnimateHeight
                duration={300}
                height={props.active === props.i ? 'auto' : 0}
              >
                <div className='flex flex-wrap gap-2 space-y-2 border-t border-[#d3d3d3] p-4  text-[13px] text-white-dark dark:border-[#1b2e4b]'>
                  {filteredItems.map((student: any, j: number) => {
                    student.present = userATT[j];
                    student.remark = attRemarks[j];
                    return (
                      <AttendanceTablet
                        key={j}
                        user={student}
                        handleChange={() => {
                          handleChange;
                        }}
                      />
                    );
                  })}
                </div>
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    mutate({
                      date: props.today,
                      attendance_type: 'Daily',
                      present: userATT,
                      remark: attRemarks,
                      student: userID,
                      class_id: props.class_id,
                    });
                  }}
                >
                  Save
                </button>
              </AnimateHeight>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AttendanceAccordion;
