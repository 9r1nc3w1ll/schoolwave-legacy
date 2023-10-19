import { clientId } from "@/utility_methods/constants";
import { GetClassStudentMembersResponse, GetUsersResponseInterface, ResponseInterface } from "@/types";

export const getStudents = async (accessToken: string): Promise<GetUsersResponseInterface[]> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
      "x-client-id": clientId!,
    }}
  );

  const tempData = (await res.json()) as ResponseInterface<
  GetUsersResponseInterface[]
  >;
  const students = tempData.data.filter((x) => x.role === "student");

  return students;
};

export const getStaffs = async (accessToken?: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
      "x-client-id": clientId!,
    }}
  );
  const tempData = await res.json();
  const staffs = tempData.data.filter((x: any) => x.is_staff);

  return staffs;
};

export const getAllUsers = async (accessToken?: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
      "x-client-id": clientId!,
    }}
  );
  const tempData = await res.json();

  return tempData;
};

export const getParents = async (accessToken?: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
      "x-client-id": clientId!,
    }}
  );
  const tempData = await res.json();
  const parents = tempData.data.filter((x: any) => x.role == "parent");

  return parents;
};

export const getUser = async (accessToken: any, id: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/users/${id.id}`, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
      "x-client-id": clientId!,
    }}
  );
  const tempData = await res.json();

  return tempData.data;
};

export const EditUser = async (accessToken: any, data: any, id: any) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users/" + id.id, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
      "x-client-id": clientId!,
    },

    body: JSON.stringify(data),
  });
  const tempData = await res.json();

  return tempData;
};

export const createUser = async (data: any, accessToken?: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
      "x-client-id": clientId!,

    },
    body: JSON.stringify(data),
  });
  const tempData = await res.json();

  return tempData;
};

export const getStudentsWithoutClass = async (accessToken: string): Promise<ResponseInterface<GetClassStudentMembersResponse>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/school/students-with-no-class/", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
      "x-client-id": clientId!,
    }}
  );

  const tempData =
    (await res.json()) as ResponseInterface<GetClassStudentMembersResponse>;

  return tempData;
};
