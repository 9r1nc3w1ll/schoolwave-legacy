import AnimateHeight from 'react-animate-height';
import { useState } from 'react';
import AttendanceTablet from './AttendanceTablet';
import { useMutation } from 'react-query';
import { showAlert } from '@/utility_methods/alert';
import { markBulkAttendance } from '@/apicalls/attendance';
import { useMarkAttendance } from '@/hooks/useMarkAttendance';

const AttendanceAccordion = (props: any) => {
    const [search, setSearch] = useState<string>('');
    const [userID, setuserId] = useState([]);
    const [userATT, setuserATT] = useState([]);
    const [attRemarks, setAttRemarks] = useState([]);
    // const [filteredItems, setFilteredItems] = useState<any>(
    //   props.attendance ? props.attendance.students : props.students
    // );

    // const { mutate, isLoading, error } = useMutation(
    //   (data: any) => {
    //     return markBulkAttendance(data, props.access_token);
    //   },
    //   {
    //     onSuccess: async (data) => {
    //       if (!data.error) {
    //         showAlert('success', 'Attendance saved successfuly');
    //       } else {
    //         showAlert('error', data.message);
    //       }
    //     },
    //     onError: (error) => {
    //       showAlert('error', 'An Error Occured');
    //     },
    //   }
    // );

    const { setAttendanceState, bulkMarkAttendance, query } = useMarkAttendance();

    const handleChange = (i: number, remarks: string, att: boolean) => {
        let attnd: any = userATT;
        let rmrks: any = attRemarks;
        attnd[i] = att;
        rmrks[i] = remarks;

        setuserATT(attnd);
        setAttRemarks(rmrks);
    };

    // useEffect(() => {
    //   setFilteredItems(() => {
    //     if (props.attendance) {
    //       return props.attendance?.students.filter((item: any) => {
    //         return (
    //           item?.first_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //           item?.last_name?.toLowerCase()?.includes(search.toLowerCase())
    //         );
    //       });
    //     } else {
    //       return props.students?.filter((item: any) => {
    //         return (
    //           item?.first_name?.toLowerCase()?.includes(search.toLowerCase()) ||
    //           item?.last_name?.toLowerCase()?.includes(search?.toLowerCase())
    //         );
    //       });
    //     }
    //   });
    // }, [search]);

    return (
        <div>
            {props?.attendance ? (
                <AnimateHeight duration={300} height="auto">
                    <div className="my-4 flex flex-wrap gap-2 space-y-2 border-t border-[#d3d3d3]  text-[13px] text-white-dark dark:border-[#1b2e4b]">
                        {props.attendance?.map((student: any) => {
                            return (
                                <AttendanceTablet
                                    key={student.id}
                                    student={student}
                                    // handleChange={() => {
                                    //   handleChange;
                                    // }}
                                />
                            );
                        })}
                    </div>
                    <button
                        className="btn btn-primary"
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
            ) : null}
        </div>
    );
};

export default AttendanceAccordion;
