import { throwError } from "@/helpers/api";
import { CreateDiscountPayload, CreateFeeItemPayload, CreateFeeTemplatePayload, CreateInvoicePayload, CreateInvoiceResponse, CreatePayload, CreateTransactionPayload, DeleteFeeItemPayload, DiscountTypes, EditFeeItemData, EditInvoicePayload, EditPayload, FeeItemInterface, FeeTemplateInterface, InvoiceTypes, ResponseInterface, TransactionInterface } from "@/types";

export const createFeeItem = async (payload: CreateFeeItemPayload): Promise<ResponseInterface<FeeItemInterface>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/fee_item", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },
    body: JSON.stringify(payload.data),
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<FeeItemInterface>;

  return tempData;
};

export const editFeeItem = async (payload: EditPayload<EditFeeItemData>): Promise<ResponseInterface<FeeItemInterface>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/fee_item/" + payload.id, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },
    body: JSON.stringify(payload.data),
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<FeeItemInterface>;

  return tempData;
};

export const deleteFeeItem = async (payload: DeleteFeeItemPayload) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/fee_item/" + payload.id, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },

  });

  if (!res.ok) {
    await throwError(res);
  }

  return res;
};

export const getFeeItems = async (accessToken: string): Promise<ResponseInterface<FeeItemInterface[]>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/fee_item", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
    }
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<FeeItemInterface[]>;

  return tempData;
};

export const getSingleFeeItem = async (id: any, access_token?: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/fee_item/" + id, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + access_token,
    }
  });
  const tempData = await res.json();

  return tempData.data;
};

export const createDiscount = async (payload: CreatePayload<CreateDiscountPayload>): Promise<ResponseInterface<DiscountTypes>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/discount", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },
    body: JSON.stringify(payload.data),
  });

  if (!res.ok) throwError(res);

  const tempData = await res.json() as ResponseInterface<DiscountTypes>;

  return tempData;
};

export const editDiscount = async (payload: EditPayload<CreateDiscountPayload>): Promise<ResponseInterface<DiscountTypes>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/discount/" + payload.id, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },
    body: JSON.stringify(payload.data),
  });

  if (!res.ok) await throwError(res);

  const tempData = await res.json() as ResponseInterface<DiscountTypes>;

  return tempData;
};

export const deleteDiscount = async (payload: { id: string; accessToken: string }) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/discount/" + payload.id, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },

  });

  if (!res.ok) {
    await throwError(res);
  }

  return res;
};

export const getDiscounts = async (accessToken: string): Promise<DiscountTypes[]> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/discount", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
    }
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<DiscountTypes[]>;

  return tempData.data;
};

export const getSingleDiscount = async (id: any, access_token?: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/discount/" + id, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + access_token,
    }
  });
  const tempData = await res.json();

  return tempData.data;
};

export const createFeeTemplate = async (payload: CreatePayload<CreateFeeTemplatePayload>): Promise<ResponseInterface<FeeTemplateInterface>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/fee_template", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },
    body: JSON.stringify(payload.data),
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<FeeTemplateInterface>;

  return tempData;
};

export const editFeeTemplate = async (payload: EditPayload<CreateFeeTemplatePayload>): Promise<ResponseInterface<FeeTemplateInterface>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/fee_template/" + payload.id, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },
    body: JSON.stringify(payload.data),
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<FeeTemplateInterface>;

  return tempData;
};

export const deleteFeeTemplate = async (id: string, accessToken: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/fee_template/" + id, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
    },

  });

  if (!res.ok) {
    await throwError(res);
  }

  return res;
};

export const getFeeTemplates = async (access_token: string): Promise<ResponseInterface<FeeTemplateInterface[]>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/fee_template", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + access_token,
    }
  });
  const tempData = await res.json();

  return tempData;
};

export const getSingleFeeTemplate = async (id: any, access_token?: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/fee_template/" + id, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + access_token,
    }
  });
  const tempData = await res.json();

  return tempData.data;
};

export const getInvoices = async (accessToken: string): Promise<ResponseInterface<InvoiceTypes[]>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/invoice", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
    }
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<InvoiceTypes[]>;

  return tempData;
};

export const getInvoiceById = async (accessToken: string, id: string): Promise<ResponseInterface<InvoiceTypes>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fees/invoice/${id}`, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
    }
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<InvoiceTypes>;

  return tempData;
};

export const getInvoiceTemplateById = async (id: string): Promise<ResponseInterface<InvoiceTypes>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fees/invoice_template/${id}`, { method: "GET" });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<InvoiceTypes>;

  return tempData;
};

export const createInvoice = async (payload: CreateInvoicePayload): Promise<ResponseInterface<CreateInvoiceResponse>> => {
  const template = {
    template: payload.template,
    items: payload.items
  };

  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/invoice/bulk_create_invoice/" + payload.classId, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },
    body: JSON.stringify(template),
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<CreateInvoiceResponse>;

  return tempData;
};

export const editInvoice = async (payload: EditInvoicePayload) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fees/invoice/${payload.id}`, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },
    body: JSON.stringify(payload.data),
  });

  if (!res.ok) {
    throwError(res);
  }
};

export const getTransactions = async (accessToken: string): Promise<ResponseInterface<TransactionInterface[]>> => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/transaction", {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + accessToken,
    }
  });

  if (!res) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<TransactionInterface[]>;

  return tempData;
};

export const createTransaction = async (payload: CreateTransactionPayload): Promise<ResponseInterface<TransactionInterface>> => {
  const body = {
    status: payload.status,
    invoice_id: payload.invoice_id,
    school: payload.school
  };

  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/fees/transaction", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<TransactionInterface>;

  return tempData;
};

export const editTransaction = async (payload: CreateTransactionPayload) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fees/transaction/${payload.id}`, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      "Authorization": "Bearer " + payload.accessToken,
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    await throwError(res);
  }

  const tempData = await res.json() as ResponseInterface<TransactionInterface>;

  return tempData;
};
