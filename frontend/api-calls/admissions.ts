import { ResponseInterface } from '@/types';
import { clientId } from '@/utility-methods/constants';
import {
  TAdmissionPayload,
  TAdmissionResponse,
  TBulkAdmissionResponse,
  TCreateAdmissionResponse,
} from '@/models/Admission';

export const BulkAdmissionUpload = async (
  data: FormData,
  accessToken?: string
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/admission/batch_upload_requests',
    {
      method: 'POST',
      body: data,
      headers: { Authorization: 'Bearer ' + accessToken },
    }
  );
  const tempData = (await res.json()) as TBulkAdmissionResponse;

  if (res.ok) {
    return tempData;
  } else {
    let msg = 'an error occured';

    if (tempData.message.split(' ')[0] === 'duplicate') {
      msg = 'one or more admission with similar record already exist';
    }

    return {
      error: true,
      message: msg,
    };
  }
};

export const createAdmission = async (
  data: TAdmissionPayload,
  accessToken?: string
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/admission/requests/create',
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'x-client-id': clientId!,
      },
    }
  );

  const tempData =
    (await res.json()) as ResponseInterface<TCreateAdmissionResponse>;

  let msg = 'an error occured';

  if (
    tempData.message.split(' ')[tempData.message.split(' ').length - 1] ===
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

export const getAdmissions = async (accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/admission/requests',
    {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'x-client-id': clientId!,
      },
    }
  );
  const tempData = (await res.json()) as ResponseInterface<TAdmissionResponse>;

  if (res.ok) {
    return tempData.data;
  } else {
    return { error: true };
  }
};

export const updateAdmission = async (
  id: Array<string>,
  approve: boolean,
  accessToken?: string,
  schoolID?: string
) => {
  const body = {
    data: { status: approve ? 'approved' : 'denied' },
    ids: id,
  };

  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/admission/batch_update_requests',
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'X-Client-Id': clientId!,
      },
    }
  );
  const tempData = (await res.json()) as ResponseInterface<TAdmissionResponse>;

  if (res.ok) {
    return tempData.data;
  }
};

export const updateAdmissionSingle = async (
  id: string,
  approve: boolean,
  accessToken?: string,
  schoolID?: string
) => {
  const body = {
    status: approve ? 'approved' : 'denied',
    ids: schoolID,
  };

  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/admission/requests/' + id,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'X-Client-Id': clientId!,
      },
    }
  );
  const tempData = (await res.json()) as ResponseInterface<TAdmissionResponse>;

  if (res.ok) {
    return tempData.data;
  } else {
    return { error: true };
  }
};
