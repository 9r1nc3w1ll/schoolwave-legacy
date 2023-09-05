export const createSchool = async (data: any, access_token?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/school/create-school-and-owner',
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
      },
    }
  );
  let tempData = await res.json();

  let msg = 'an error occured';

  if (
    tempData.message.split(' ')[tempData.message.split(' ').length - 1] ==
    'exists.'
  ) {
    msg = 'student information with this username already exists.';
  }
  if (res.ok) {
    return tempData.data;
  } else {
    return {
      error: true,
      message: msg,
    };
  }
};
