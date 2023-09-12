import { Student } from '@/models/Attendance';
import { ChangeEventHandler, SetStateAction, useEffect, useState } from 'react';

interface AtendanceTabletProps {
    student: Student;
    handlePresentChange: ChangeEventHandler<HTMLInputElement>;
    handleRemarkChange: ChangeEventHandler<HTMLSelectElement>;
    remark: string;
    status: string;
}

const AttendanceTabletNew: React.FC<AtendanceTabletProps> = ({ student, handlePresentChange, handleRemarkChange, remark, status }) => {
    // const [present, setpresent] = useState(pr);
    // const [remark, setremark] = useState(props.user.remark);

    // useEffect(() => {
    //   props.handleChange(props.key, remark, present);
    // }, [present, remark]);

    return (
        <form className={`max-w-[220px] bg-${student.status ? 'primary' : 'black'}-light rounded-sm p-2 shadow-md hover:shadow-sm`}>
            <div className="mb-2 flex gap-2">
                <input type="checkbox" className="" checked={student?.status} onChange={handlePresentChange} />
                <h1>{`${student?.student_info.first_name} ${student?.student_info.last_name}`}</h1>
            </div>
            <div>
                <select className="form-select text-white-dark" value={remark[]} defaultValue="Unfilled" onChange={handleRemarkChange}>
                    <option>Remark</option>
                    <option value="Unexcused">Unexcused</option>
                    <option value="Excused">Excused</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Punctual">Punctual</option>
                    <option value="Unfilled">Unfilled</option>
                </select>
            </div>
        </form>
    );
};

export default AttendanceTabletNew;
