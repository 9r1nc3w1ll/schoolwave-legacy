export type TStudentInfo = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  religion: string;
  phone_number: string;
  city: string;
  state: string;
  address: string;
  guardian_name: string;
  relation: string;
  guardian_occupation: string;
  guardian_phone_number: string;
  guardian_address: string;
};

export type TBulkAdmissionResponse = {
  message: string;
  error?: string;
};

export type TAdmissionPayload = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  religion: string;
  phone_number: string;
  city: string;
  state: string;
  address: string;
  guardian_name: string;
  guardian_occupation: string;
  guardian_phone_number: string;
  guardian_address: string;
  school: string;
};

export type TCreateAdmissionResponse = {
  id: string;
  student_info: TStudentInfo;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  status: string;
  comment_if_declined: string;
  student_number: string;
  school: string;
};

export type TAdmissionResponse = {
  id: string;
  student_info: TStudentInfo;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  status: string;
  comment_if_declined: string;
  student_number: string;
  school: string;
};
