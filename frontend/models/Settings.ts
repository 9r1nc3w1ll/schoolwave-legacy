export interface ISettingsResponse {
  logo: {
    file: string;
  };
  brand: {
    primary_color: string;
    secondary_color: string;
  };
  school_id: string;
  school_name: string;
  school_radius: number;
  school_latitude: number;
  storage_options: {
    token: string;
    driver: string;
    default: boolean;
    base_path: string;
  };
  school_longitude: number;
  staff_code_prefix: string;
  student_code_prefix: string;
}

export interface ISettingsPayload {
  settings: {
    logo: {
      file: string;
    };
    brand: {
      primary_color: string;
      secondary_color: string;
    };
    school_id: string;
    school_name: string;
    school_radius: number;
    school_latitude: number;
    storage_options: {
      token: string;
      driver: string;
      default: boolean;
      base_path: string;
    };
    school_longitude: number;
    staff_code_prefix: string;
    student_code_prefix: string;
  };
}

export interface ISettings {
  logo: {
    file: string;
  };
  brand: {
    primaryColor: string;
    secondaryColor: string;
  };
  schoolId: string;
  schoolName: string;
  schoolRadius: number;
  schoolLatitude: number;
  storageOptions: {
    token: string;
    driver: string;
    default: boolean;
    basePath: string;
  };
  schoolLongitude: number;
  staffCodePrefix: string;
  studentCodePrefix: string;
}

export type SettingsPayloadTypes = {
  field: keyof ISettings;
  value: string | number;
};

export type ISettingsNavTypes = {
  activeTab: "basic" | "session" | "email";
};

export type SettingsTabs = {
  [key: string]: {
    id: string;
    title: string;
    component: JSX.Element;
  };
};
