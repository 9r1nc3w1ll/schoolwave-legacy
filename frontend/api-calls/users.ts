import { clientId } from "@/utility-methods/constants";
import {
  GetClassStudentMembersResponse,
  GetUsersResponseInterface,
  ResponseInterface,
} from "@/types";
import { IUser, IUserResponse } from "@/models/User";

export const getStudents = async (
  accessToken: string
): Promise<GetUsersResponseInterface[]> => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users",
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
    }
  );

  const tempData = (await res.json()) as ResponseInterface<
  GetUsersResponseInterface[]
  >;
  const students = tempData.data.filter((x) => x.role === "student");

  return students;
};

export const getStaffs = async (accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users",
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
    }
  );

  const tempData = (await res.json()) as ResponseInterface<
  GetUsersResponseInterface[]
  >;

  const staffs = tempData.data.filter(
    (x: GetUsersResponseInterface) => x.is_staff
  );

  return staffs;
};

export const getAllUsers = async (accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users",
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
    }
  );

  const tempData = (await res.json()) as ResponseInterface<
  GetUsersResponseInterface[]
  >;

  return tempData;
};

export const getParents = async (accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users",
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
    }
  );

  const tempData = (await res.json()) as ResponseInterface<
  GetUsersResponseInterface[]
  >;

  const parents = tempData.data.filter(
    (x: GetUsersResponseInterface) => x.role === "parent"
  );

  return parents;
};

export const getUser = async (accessToken: string | undefined, id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/users/${id}`,
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
    }
  );

  const tempData = (await res.json()) as ResponseInterface<
  IUserResponse
  >;

  return tempData.data;
};

export const EditUser = async (
  accessToken: string | undefined,
  data: IUser,
  id: string
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users/" + id,
    {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },

      body: JSON.stringify(data),
    }
  );

  const tempData = (await res.json()) as ResponseInterface<IUserResponse>;

  return tempData;
};

export const createUser = async (data: IUser, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users",
    {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
      body: JSON.stringify(data),
    }
  );
  const tempData = (await res.json()) as ResponseInterface<IUserResponse>;

  return tempData;
};

export const getStudentsWithoutClass = async (
  accessToken: string
): Promise<ResponseInterface<GetClassStudentMembersResponse>> => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/school/students-with-no-class/",
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
    }
  );

  const tempData =
    (await res.json()) as ResponseInterface<GetClassStudentMembersResponse>;

  return tempData;
};
