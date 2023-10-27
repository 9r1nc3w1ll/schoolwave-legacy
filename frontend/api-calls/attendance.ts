import { throwError } from '@/helpers/api';
import { clientId } from '@/utility-methods/constants';

export const getAttendance = async (data: any, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL +
      `/attendance/student-attendance/${data?.class}/${data?.startDate}/${data?.endDate}`,
    {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'x-client-id': clientId!,
      },
    }
  );
  const tempData = await res.json();

  return tempData.data;
};

export const markAttendance = async (data: any, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL +
      `/attendance/student-attendance/${data?.class}/${data?.startDate}/${data?.endDate}`,
    {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'x-client-id': clientId!,
      },
    }
  );

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json();

  return tempData.data;
};

export const markBulkAttendance = async (data: any, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL +
      '/attendance/student-attendance/create',
    {
      method: 'POST',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'x-client-id': clientId!,
      },
      body: JSON.stringify(data),
    }
  );
  const tempData = await res.json();

  if (res.ok) {
    return tempData;
  } else {
    let msg = 'An error occured';

    if (
      tempData.message.split(' ')[tempData.message.split(' ').length - 1] ==
      'exists.'
    ) {
      msg = 'Class with class Code already exists';
    }

    return {
      error: true,
      message: msg,
    };
  }
};
