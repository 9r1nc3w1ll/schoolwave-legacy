import { Student } from '@/models/Attendance';
import { useEffect, useState } from 'react';

interface AtendanceTabletProps {
    student: Student;
}

const AttendanceTabletNew: React.FC<AtendanceTabletProps> = ({ student }) => {
    // const [present, setpresent] = useState(pr);
    // const [remark, setremark] = useState(props.user.remark);

    // useEffect(() => {
    //   props.handleChange(props.key, remark, present);
    // }, [present, remark]);

    return (
        <form className={`max-w-[220px] bg-${student.status ? 'primary' : 'black'}-light rounded-sm p-2 shadow-md hover:shadow-sm`}>
            <div className="mb-2 flex gap-2">
                <input
                    type="checkbox"
                    className=""
                    checked={student?.status}
                    // onChange={() => {
                    //   setpresent(!present);
                    // }}
                />
                <h1>{`${student?.student_info.first_name} ${student?.student_info.last_name}`}</h1>
            </div>
            <div>
                <select
                    className="form-select text-white-dark"
                    // value={}
                    // onChange={(e) => {
                    //   setremark(e.target.value);
                    // }}
                >
                    <option>Remark</option>
                    <option>Unexcused</option>
                    <option>Excused</option>
                    <option>Absent</option>
                    <option>Late</option>
                    <option>Punctual</option>
                </select>
            </div>
        </form>
    );
};

export default AttendanceTabletNew;
