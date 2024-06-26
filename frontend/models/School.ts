import { ISettings } from "./Settings";
import { type ClassInfo, type StudentInfo } from "@/types";

export interface ISchool {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  name: string;
  description: string;
  logo_file_name: string;
  date_of_establishment: string;
  motto: string;
  tag: string;
  website_url: string;
  owner: string;
  owner_username: string;
  owner_email: string;
  owner_fullname: string;
}

export type TSchool = {
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
  settings: ISettings;
  logo_file: string;
  owner: string;
};

export type Student = {
  user: string;
  role: string;
  class_id: string;
  class_info: ClassInfo;
  student_info: StudentInfo;
  school: string;
};
