import { clientId } from "@/utility_methods/constants";

export const BulkSubjectsUpload = async (data: any, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/subject/batch_upload_requests",
    {
      method: "POST",
      body: data,
      headers: {
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
    }
  );
  const tempData = await res.json();

  return tempData;
};

export const getSubjects = async (accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/subject/subjects",
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
    }
  );
  const tempData = await res.json();

  return tempData.data;
};

export const updateSubject = async (
  id: string,
  approve: boolean,
  accessToken?: string
) => {
  const bdy: any = {};

  bdy.status = approve ? "approved" : "denied";

  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/subject/subjects/{id}" + id,
    {
      method: "PATCH",
      body: JSON.stringify(bdy),
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
    }
  );
  const tempData = await res.json();

  return tempData.data;
};

export const editSubject = async (
  id: string,
  accessToken: string,
  data: any
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/subject/subjects/" + id,
    {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
      body: JSON.stringify(data),
    }
  );
  const tempData = await res.json();

  return tempData;
};

export const CreateSubject = async (data: any, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/subject/subjects",
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
  const tempData = await res.json();

  return tempData;
};

export const AssignStaffToSubject = async (
  data: any,
  accessToken?: string
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/subject/subject-staff-assignment",
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
  const tempData = await res.json();

  return tempData;
};

export const getSingleSubject = async (id: any, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/subject/subjects/" + id,
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "x-client-id": clientId!,
      },
    }
  );
  const tempData = await res.json();

  return tempData.data;
};
