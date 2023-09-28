export type ClassInfo = {
  id: string;
  name: string;
  description: string;
  class_index: number;
  code: string;
};

export type StudentInfo = {
  id: string;
  first_name: string;
  last_name: string;
};

export type AttendancePayload = {
  deleted_at: string;
  date: string;
  start_time: string;
  end_time: string;
  attendance_type: string;
  role: "student" | "admin" | "super_admin";
  attendee: string;
  class_id: string;
  subject: string;
  staff: string;
  school: string;
  student: string[];
  present: boolean[];
  remark: string[];
};

export type RemarkActionTypes = {
  index: number;
  remark: string;
  studentID: string;
};

export type AttendancePayloadTypes = {
  field: keyof AttendancePayload;
  value: string | number;
};

export type Student = {
  user: string;
  role: "student" | "admin" | "super_admin";
  class_id: string;
  class_info: ClassInfo;
  student_info: StudentInfo;
  school: string;
  status: boolean;
};
