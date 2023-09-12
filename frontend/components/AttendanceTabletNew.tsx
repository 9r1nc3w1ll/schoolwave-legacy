import { Student } from '@/models/Attendance';
import { ChangeEventHandler, useMemo } from 'react';

interface AtendanceTabletProps {
    student: Student;
    handleRemarkChange: ChangeEventHandler<HTMLSelectElement>;
    remark: string[];
    identifier: number;
}

const AttendanceTabletNew: React.FC<AtendanceTabletProps> = ({ student, handleRemarkChange, remark, identifier }) => {
    const options = ['Unexcused', 'Excused', 'Absent', 'Late', 'Punctual', 'Unfilled'];
    return (
        <form className={`max-w-[220px] bg-${student.status ? 'primary' : 'black'}-light rounded-sm p-2 shadow-md hover:shadow-sm`}>
            <div className="mb-2 flex gap-2">
                <input type="checkbox" className="" checked={student?.status} />
                <h1>{`${student?.student_info.first_name} ${student?.student_info.last_name}`}</h1>
            </div>
            <div>
                <select className="form-select text-white-dark" defaultValue="Unfilled" onChange={handleRemarkChange}>
                    {options.map((option) => {
                        return (
                            <option value={option} selected={remark[identifier] === option}>
                                {option}
                            </option>
                        );
                    })}
                </select>
            </div>
        </form>
    );
};

export default AttendanceTabletNew;
