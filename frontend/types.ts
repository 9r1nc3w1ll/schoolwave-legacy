import { Session } from "next-auth/core/types";

export interface ClassInfo {
  id: string;
  name: string;
  description: string;
  class_index: number;
  code: string;
}

export interface DiscountInfo {
  id: string;
  discount_type: string;
  amount: null;
  percentage: number;
}

export interface SchoolInfo {
  id: string;
  name: string;
}

export interface FeeTemplateInterface {
  id: string;
  school_info: SchoolInfo;
  class_info: ClassInfo;
  discount_info: DiscountInfo;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  name: string;
  description: string;
  tax: number;
  active: boolean;
  school: string;
  class_id: string;
  discount: string;
  required_items: string[];
  optional_items: string[];
}

export interface ResponseInterface<T> {
  data: T;
  message: string;
  status: "success" | "error";
}

export interface DeleteFeeTemplatePayload {
  feeTemplateId: string;
}

export interface IClientError {
  message: string;
}

export interface User {
  name: string;
  email: string;
}

export interface ClassData {
  id: string;
  name: string;
  description: string;
  class_index: number;
  code: string;
  school: string;
  student_count: number;
  class_teacher: null;
}

export interface School {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  name: string;
  description: string;
  logo_file_name: string;
  date_of_establishment: string;
  motto: string;
  tag: string;
  website_url: string;
  owner: string;
}

export interface UserSession extends Session {
  user: User;
  expires: string;
  id: string;
  last_login: string;
  is_superuser: boolean;
  username: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  date_of_birth: null;
  gender: null;
  blood_group: null;
  religion: null;
  phone_number: null;
  city: null;
  state: null;
  address: null;
  guardian_name: null;
  relation: null;
  guardian_occupation: null;
  guardian_phone_number: null;
  guardian_address: null;
  school: School;
  name: string;
  access_token: string;
  refresh_token: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface ClassUserAssignmentProps {
  student: boolean;
  user_session: UserSession;
  classData: ClassData;
  refreshClasses: () => void;
}

export interface CreateInvoicePayload {
  template: string;
  items: string[];
  accessToken: string;
  classId: string;
}

export interface CreateInvoiceResponse {
  template: string;
  items: string[];
}

export type SessionStatus = "authenticated" | "loading" | "unauthenticated";

export interface CreateTransactionPayload {
  status?: string;
  content_type?: number;
  invoice_id?: string;
  school?: string;
  accessToken: string;
  reversed_transaction_id?: string;
  id?: string;
}

export interface TransactionInterface {
  id: string;
  school_info: SchoolInfo;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  invoice_id: string;
  reversed_transaction_id: string;
  status: string;
  content_type: number;
  school: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  amount: number;
  tax: number;
  discount: number;
}

export interface Info {
  id: string;
  name: string;
}

export interface StudentInfo {
  id: string;
  first_name: string;
  last_name: string;
}

export interface InvoiceTypes {
  id: string;
  school_info: Info;
  template_info: Info;
  items: Item[];
  student_info: StudentInfo;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  name: string;
  description: string;
  amount_paid: string;
  balance: string;
  outstanding_balance: string;
  school: string;
  template: string;
  student: string;
}

export interface FeeItemInterface {
  id: string;
  school_info: SchoolInfo;
  discount_info: DiscountInfo;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  name: string;
  description: string;
  amount: string;
  tax: string;
  discount: string;
  school: string;
}

export interface DeleteFeeItemPayload {
  id: string;
  accessToken: string;
}

interface CreateFeeItemData {
  name: string;
  description: string;
  amount: number;
  discount: string;
  school: string;
}

export interface CreateFeeItemPayload {
  data: CreateFeeItemData;
  accessToken: string;
}

export interface EditInvoiceData {
  name: string;
  description: string;
  amount_paid: number;
  balance: number;
  outstnding_balance: number;
  template: string;
  school: string;
}

export interface EditInvoicePayload {
  accessToken: string;
  id: string;
  data: EditInvoiceData;
}

export interface EditPayload<T> {
  accessToken: string;
  id: string;
  data: T;
}

export interface EditFeeItemData {
  name: string;
  amount: number;
  description: string;
  school: string;
  discount: string;
  tax?: number;
}

export interface DiscountTypes {
  id: string;
  school_info: SchoolInfo;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  name: string;
  description: string;
  discount_type: string;
  amount: number | null;
  percentage: number | null;
  school: string;
}

export interface FeeItemFormValues {
  name: string;
  description: string;
  amount: number;
  discount: string;
}

export interface CreatePayload<T> {
  accessToken: string;
  data: T;
}

export interface CreateFeeTemplatePayload {
  school: string;
  required_items: string[];
  optional_items: string[];
  active: boolean;
  tax?: number;
  name: string;
  description: string;
  class_id: string;
  discount: string;
}

// Generated by https://quicktype.io

export interface ClassTypes {
  id: string;
  name: string;
  description: string;
  class_index: number;
  code: string;
  school: string;
  student_count: number;
  class_teacher: null;
}

export interface FeeTemplateFormValues {
  name: string;
  description: string;
  class_id: string;
  discount: string;
}

export interface RefinedFeeItem {
  value: string;
  label: string;
}

export interface CreateDiscountPayload {
  name: string;
  description: string;
  discount_type: string;
  amount: number;
  percentage: number;
  school: string;
}

export interface DiscountFormValues {
  name: string;
  description: string;
  discount_type: string;
  amount: number;
  percentage: number;
}

export interface CreateStaffData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  gender: string;
  role: string;
  religion: string;
  phone_number: string;
  city: string;
  state: string;
  address: string;
  is_staff: boolean;
  password: string;
  roles: string[];
  school: string;
}

export interface CreateStaffRoleData {
  name: string;
  description: string;
}

export interface StaffRole {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  name: string;
  description: string;
}

export interface GetStaffRolesType {
  message: string;
  data: StaffRole[];
}

export interface GetClassStudentMembersResponse {
  user: string;
  role: string;
  class_id: string;
  class_info: ClassInfo;
  student_info: StudentInfo;
  school: string;
}

export interface UserInfo {
  user: string;
  first_name: string;
  last_name: string;
}

export interface GetAllStaffType {
  id: string;
  user_info: UserInfo;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  title: string;
  staff_number: string;
  user: string;
  school: string;
  roles: string[];
}

export type AssignUserToClassPayload = {
  user: string;
  role: string;
  class_id: string;
  school: string;
};

export interface AssignUserToClassResponse {
  user: string;
  role: string;
  class_id: string;
  class_info: ClassInfo;
  student_info: StudentInfo;
  school: string;
}

export interface GetUsersResponseInterface {
  id: string;
  profile_photo: null;
  last_login: null | string;
  is_superuser: boolean;
  username: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  date_of_birth: null | string;
  gender: string | null;
  blood_group: null | string;
  religion: string | null;
  phone_number: null | string;
  city: string | null;
  state: string | null;
  address: null | string;
  guardian_name: null | string;
  relation: null | string;
  guardian_occupation: null | string;
  guardian_phone_number: null | string;
  guardian_address: null | string;
  school: null | string;
}

export type BulkEmployeeUploadPayload = {
  data: FormData;
  accessToken: string;
};

// Generated by https://quicktype.io

export interface BulkUploadEmployeeResponse {
  id: string;
  user_info: UserInfo;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  title: string;
  staff_number: null;
  user: string;
  school: string;
  roles: string[];
}
