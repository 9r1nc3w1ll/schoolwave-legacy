import { TSchool } from "@/models";
import { User } from "next-auth";

interface IErrorResponse {
  status: string;
  message: string;
  field_name: string;
  data: null;
}

type TLoginResponse = {
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
    school?: TSchool;
  };
};
type TRefreshUserResponse = {
  message: string;
  data: {
    user: User;
    school?: TSchool;
  };
};
type TCreateOwnerInput = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

const LOGIN_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/login`;
const GET_SESSION_USER_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/refresh-auth-user`;
const CREATE_OWNER_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/create-super-admin`;

class ApiCall<TSuccess, _TError> extends Promise<TSuccess> {}

class ApiError extends Error {
  public message!: string;
  public name!: string;
  public stack?: string;

  constructor (message: string, options: ErrorOptions) {
    super(message, options);
    this.name = "ApiError";
    this.message = message;
  }
}

export const loginWithCredentials = async (
  username: string,
  password: string
): ApiCall<TLoginResponse, ApiError> => {
  return new ApiCall<TLoginResponse, ApiError>(async (resolve, reject) => {
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        reject(new ApiError("login request failed", { cause: response }));
      }

      const data = await getTypedJson<TLoginResponse>(response);

      resolve(data);
    } catch (error) {
      reject(new ApiError("loginWithCredentials failed", { cause: error }));
    }
  });
};

export const createOwner = async (
  input: TCreateOwnerInput
): ApiCall<TLoginResponse, ApiError> => {
  return new ApiCall<TLoginResponse, ApiError>((resolve, reject) => {
    fetch(CREATE_OWNER_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((response) => {
        getTypedJson<TLoginResponse>(response).then((typedData) =>
          resolve(typedData)
        );
      })
      .catch((error) =>
        reject(new ApiError("refreshLoggedInUser failed", { cause: error }))
      );
  });
};

export const getSessionUser = async (
  accessToken?: string
): ApiCall<TRefreshUserResponse, ApiError> => {
  return new ApiCall<TRefreshUserResponse, ApiError>((resolve, reject) => {
    fetch(GET_SESSION_USER_URL, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      },
    })
      .then((response) => {
        getTypedJson<TRefreshUserResponse>(response).then((typedData) =>
          resolve(typedData)
        );
      })
      .catch((error) =>
        reject(new ApiError("refreshLoggedInUser failed", { cause: error }))
      );
  });
};

export const throwError = async (res: Response): Promise<void> => {
  if (res.status === 500) {
    let error = { message: "" };
    const tempError = (await res.json()) as IErrorResponse;

    if (tempError?.message) {
      if (tempError.message.split(" ")[0] === "duplicate") {
        error = { message: "One or more rows with similar record already exists" };
      } else {
        error = { message: tempError.message };
      }
    } else {
      error = { message: "Server Error" };
    }

    throw error;
  } else if (res.status > 500) {
    const error = { message: "Server Error" };

    throw error;
  } else {
    const tempError = (await res.json()) as IErrorResponse;
    const error = { message: tempError.message };

    throw error;
  }
};

const getTypedJson = async <T>(response: Response): Promise<T> => {
  return response.json() as T;
};

export function getFirstLetters (str: string) {
  const words = str.split(" ");
  const firstLetters = words.map((word) => word.charAt(0));

  return firstLetters.join("");
}

const api = {
  loginWithCredentials,
  getSessionUser,
  createOwner,
};

export default api;
