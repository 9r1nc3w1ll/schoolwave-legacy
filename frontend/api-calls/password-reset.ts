import { ResponseInterface } from "@/types";
import { IUserResponse, ReqestPasswordPayload, ResetPassword } from "@/models/User";

export const requestPasswordReset = async (data: ReqestPasswordPayload) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/password/request_reset`,
    {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  const tempData = (await res.json()) as ResponseInterface<IUserResponse>;

  return tempData;
};

export const resetPassword = async (data: ResetPassword) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/password/reset_password`,
    {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  const tempData = (await res.json()) as ResponseInterface<IUserResponse>;

  return tempData;
};
