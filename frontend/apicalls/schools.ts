export const createSchool = async (data: any, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/school/create-school-and-owner",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
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

export const getSchools = async (schoolID?: string, accessToken?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/school/school-list",
    {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "X-Client-Id": schoolID,
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
