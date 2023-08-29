import InvoiceSelect from "./InvoiceSelect";
import { SetStateAction } from "react";
import { createTransaction } from "@/apicalls/fees";
import { showAlert } from "@/utility_methods/alert";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { IClientError, SessionStatus, UserSession } from "@/types";

interface CreateInvoiceProps {
  user_session_status: SessionStatus;
  user_session: UserSession;
  setmodal: React.Dispatch<SetStateAction<boolean>>;
  refreshEmployee: () => void;
}

export interface CreateTransactionFormvalues {
  status: string;
  invoice_id: string;
}

const CreateTransaction = (props: CreateInvoiceProps) => {
  const { register, handleSubmit, reset, watch } = useForm<CreateTransactionFormvalues>({ shouldUseNativeValidation: true });

  const { mutate } = useMutation(createTransaction,
    {
      onSuccess: async () => {
        showAlert("success", "Invoice generated Successfuly");
        props.refreshEmployee();
        props.setmodal(false);
        reset();
      },
      onError: (error: IClientError) => {
        showAlert("error", error.message);
      }
    }
  );

  const onSubmit = handleSubmit(async (tnxData) => {
    mutate({
      ...tnxData,
      accessToken: props.user_session.access_token,
      school: props.user_session.school.id
    });
  });

  return (
    <div className="">
      <form className="space-y-5" onSubmit={onSubmit}>
        <h1>Create Transaction</h1>
        <div>
          <InvoiceSelect watch={watch} register={register} user_session_status={props.user_session_status} user_session={props.user_session} />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
            Status
          </label>
          <select
            id="status"
            className="form-input"
            {...register("status", { required: "Status is required" })}>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="flex justify-center items-center mt-8 mx-auto">
          <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTransaction;
