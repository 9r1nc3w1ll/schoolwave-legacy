import AjaxLoader from "./Layouts/AjaxLoader";
import AnimateHeight from "react-animate-height";
import AttendanceTabletNew from "./AttendanceTabletNew";
import Loader from "./Loader";
import React from "react";
import { Student } from "@/models/Attendance";
import { useMarkAttendance } from "@/hooks/useMarkAttendance";

interface AttendanceAccordion {
  classId: string;
  attendance: Student[];
  role: "student" | "admin";
  school: string;
  attendee: string;
  loading: boolean;
}

const AttendanceAccordion: React.FC<AttendanceAccordion> = ({
  classId,
  attendance,
  role,
  school,
  attendee,
  loading,
}) => {
  const { bulkMarkAttendance, query, addRemark, isMarkingAttendance } =
    useMarkAttendance();

  return (
    <div>
      <h3 className="text-lg font-medium">Students Attendance List</h3>
      <hr />
      {loading && (
        <div className="py-6">
          <AjaxLoader />
        </div>
      )}
      {attendance && attendance.length > 0
        ? (
          <AnimateHeight duration={300} height="auto">
            <div className="my-4 mb-6 flex flex-wrap gap-2 space-y-2 border-[#d3d3d3]  text-[13px] text-white-dark dark:border-[#1b2e4b]">
              {attendance &&
              attendance?.map((student: Student, index: number) => {
                return (
                  <AttendanceTabletNew
                    key={student?.student_info?.id}
                    student={student}
                    handleRemarkChange={(e) =>
                      addRemark({
                        index,
                        remark: e.target.value,
                        studentID: student?.student_info?.id,
                      })
                    }
                    remark={query?.remark ?? []}
                    identifier={index}
                  />
                );
              })}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                bulkMarkAttendance({
                  date: new Date().toISOString(),
                  attendance_type: "Daily",
                  present: query?.present,
                  remark: query?.remark,
                  student: query?.student,
                  class_id: classId,
                  school,
                  attendee,
                  role,
                });
              }}
            >
              {isMarkingAttendance ? <Loader /> : "Save"}
            </button>
          </AnimateHeight>
        )
        : attendance && (attendance as Student[]).length === 0 && !loading
          ? (
            <p className="my-4">No Data Found</p>
          )
          : null}
    </div>
  );
};

export default AttendanceAccordion;
