import { clientId } from "@/utility_methods/constants";

export const getDashboardStats = async (
  schoolID: string,
  accessToken?: string
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/school/dashboard-stats/' + schoolID,
    {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        "x-client-id": clientId!,
      },
    }
  );
  const tempData = await res.json();

  if (res.ok) {
    return tempData.data;
  } else {
    return { error: true };
  }
};
