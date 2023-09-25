import { ISettingsPayload } from '@/models/Settings';

export const getSchoolSettings = async (
  access_token: string,
  schoolID: string
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/school/school-settings/' + schoolID,
    {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
      },
    }
  );
  let tempData = await res.json();
  if (res.ok) {
    return tempData.settings;
  } else {
    return {
      error: true,
    };
  }
};

export const updateSettings = async (
  data: ISettingsPayload,
  access_token?: string,
  schoolID?: string
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + `/school/school-settings/${schoolID}`,
    {
      method: 'PATCH',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
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
