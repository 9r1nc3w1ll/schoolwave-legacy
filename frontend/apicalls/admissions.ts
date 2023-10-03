export const BulkAdmissionUpload = async (data: any, access_token?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/admission/batch_upload_requests",
    {
      method: "POST",
      body: data,
      headers: { Authorization: "Bearer " + access_token },
    }
  );
  const tempData = await res.json();

  if (res.ok) {
    return tempData;
  } else {
    let msg = "an error occured";

    if (tempData.message.split(" ")[0] == "duplicate") {
      msg = "one or more admission with similar record already exist";
    }

    return {
      error: true,
      message: msg,
    };
  }
};

export const createAdmission = async (data: any, access_token?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/admission/requests/create",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
      },
    }
  );
  const tempData = await res.json();

  let msg = "an error occured";

  if (
    tempData.message.split(" ")[tempData.message.split(" ").length - 1] ==
    "exists."
  ) {
    msg = "student information with this username already exists.";
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

export const getAdmissions = async (
  access_token?: string
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/admission/requests",
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
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

export const updateAdmission = async (
  id: string,
  approve: boolean,
  access_token?: string
) => {
  const bdy: any = {};

  bdy.status = approve ? "approved" : "denied";

  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/admission/requests/" + id,
    {
      method: "PATCH",
      body: JSON.stringify(bdy),
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + access_token,
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
