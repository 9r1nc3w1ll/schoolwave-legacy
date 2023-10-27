import { clientId } from '@/utility-methods/constants';

export const createSession = async (accessToken: string, data: any) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session',
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
        'exists.' ||
      tempData.message.split(' ')[0] == 'duplicate'
    ) {
      msg = 'Session already exists';
    }

    return {
      error: true,
      message: msg,
    };
  }
};

export const editSession = async (
  id: string,
  accessToken: string,
  data: any
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session/' + id,
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

  return tempData;
};

export const deleteSession = async (id: string, access_token: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session/' + id,
    {
      method: 'DELETE',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
        'x-client-id': clientId!,
      },
    }
  );

  return res;
};

export const getSession = async (accessToken: any) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session',
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

  return tempData;
};

export const getSingleSession = async (id: any, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/session/session/' + id,
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

export const getTerms = async (id: any, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/session/term?session_id=' + id,
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

export const getAllTerms = async (accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/session/term',
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

export const createTerm = async (data: any, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/session/term',
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

  return tempData;
};

export const deleteTerm = async (id: string, access_token: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/session/term/' + id,
    {
      method: 'DELETE',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
        'x-client-id': clientId!,
      },
    }
  );

  return res;
};
