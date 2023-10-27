import { ISettingsPayload } from '@/models/Settings';
import { clientId } from '@/utility-methods/constants';

export const getSchoolSettings = async (
  accessToken: string,
  schoolID: string
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/school/school-settings/' + schoolID,
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

  if (res.ok) {
    return tempData.settings;
  } else {
    return { error: true };
  }
};

export const updateSettings = async (
  data: ISettingsPayload,
  accessToken?: string,
  schoolID?: string
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + `/school/school-settings/${schoolID}`,
    {
      method: 'PATCH',
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
