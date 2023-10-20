import { clientId } from "@/utility_methods/constants";

export const getRoles = async (accessToken: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/staff-role-list`, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
      "x-client-id": clientId!,
    }
  });
  const tempData = await res.json();

  return tempData.data;
};

