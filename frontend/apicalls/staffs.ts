import { throwError } from "@/helpers/api";
import { BulkEmployeeUploadPayload, BulkUploadEmployeeResponse, CreatePayload, CreateStaffData, CreateStaffRoleData, GetAllStaffType, GetStaffRolesType, ResponseInterface } from "@/types";

interface Staff {

  username: string;
  password: string;
  first_name: string;
  last_name: string;
  title: string;
  roles: string[];

}

export const getAllStaff = async (accessToken?: string): Promise<GetAllStaffType[]> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/staff/staff-list", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
    }
  });
  const tempData = await res.json() as ResponseInterface<GetAllStaffType[]>;

  return tempData.data;
};

export const CreateStaff = async (payload: CreatePayload<CreateStaffData>) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/staff/staff-list", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken
    },
    body: JSON.stringify(payload.data)
  });

  if (!res.ok) {
    await throwError(res);
  }

  return await res.json();
};

export const EditStaff = async (id: string, access_token: string, data: Staff) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/staff/staff-list" + id, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer" + access_token
    },
    body: JSON.stringify(data)
  });

  return await res.json();
};

export const getStaffRoles = async (accessToken: string): Promise<GetStaffRolesType> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/staff-role-list`, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken
    },
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as GetStaffRolesType;

  return tempData;
};

export const createStaffRole = async (payload: CreatePayload<CreateStaffRoleData>) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/staff/staff-role-list", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken
    },
    body: JSON.stringify(payload.data)
  });

  if (!res.ok) {
    await throwError(res);
  }

  return await res.json();
};

export const bulkEmployeeUpload = async (payload: BulkEmployeeUploadPayload): Promise<BulkUploadEmployeeResponse> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/staff/batch_upload", {
    method: "POST",
    headers: { "Authorization": "Bearer " + payload.accessToken },
    body: payload.data,
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as BulkUploadEmployeeResponse;

  return tempData;
};
