export interface IUser {
  password: string;
  profile_photo: {
    file: string;
  };
  last_login: string;
  is_superuser: boolean;
  username: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  date_of_birth: string;
  gender: "male" | "female";
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
}

export interface IUserResponse extends IUser {
  id: string;
}
