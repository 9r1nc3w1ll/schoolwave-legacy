export const requestPasswordReset = async (data: IUser, accessToken?: string) => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/account/users",
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          "Authorization": "Bearer " + accessToken,
          "x-client-id": clientId!,
        },
        body: JSON.stringify(data),
      }
    );
    const tempData = (await res.json()) as ResponseInterface<IUserResponse>;
  
    return tempData;
  };
  