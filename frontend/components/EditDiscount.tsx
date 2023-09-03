import { editDiscount } from "@/apicalls/fees";
import { showAlert } from "@/utility_methods/alert";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { DiscountFormValues, DiscountTypes, IClientError, UserSession } from "@/types";
import { SetStateAction, useEffect } from "react";

interface EditDiscountProps {
  create: boolean;
  user_session: UserSession;
  sessionData: DiscountTypes;
  exit: React.Dispatch<SetStateAction<boolean>>;
  refreshSession: () => void;
}

const EditDiscount = (props: EditDiscountProps) => {
  const { register, handleSubmit, reset } = useForm<DiscountFormValues>({ shouldUseNativeValidation: true });

  useEffect(() => {
    reset({
      name: props.sessionData.name,
      description: props.sessionData.description,
      discount_type: props.sessionData.discount_type,
      amount: props.sessionData.amount ?? 0,
      percentage: props.sessionData.percentage ?? 0
    });
  }, []);

  const { mutate } = useMutation(editDiscount,
    {
      onSuccess: async () => {
        showAlert("success", "Session Edited Successfuly");
        props.refreshSession();
        props.exit(false);
      },
      onError: (error: IClientError) => {
        showAlert("error", error.message);
      }
    }
  );

  const onSubmit = handleSubmit(async (data) => {
    mutate({
      data: {
        ...data,
        school: props.sessionData?.school
      },
      id: props.sessionData.id,
      accessToken: props.user_session.access_token
    });
  });

  return (
    <div className="">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input id="description" type="text" className="form-input" {...register("description", { required: false })} />
        </div>
        <div>
          <label htmlFor="discount_type">Discount Type</label>
          <select
            id="discount_type"
            className="form-input"
            {...register("discount_type", { required: "Discount type is required" })}>
            <option value="percentage">Percentage</option>
            <option value="amount">Amount</option>
          </select>
        </div>
        <div>
          <label htmlFor="name">Amount</label>
          <input id="amount" type="number" className="form-input" {...register("amount", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name">Percentage</label>
          <input id="percentage" type="number" className="form-input" {...register("percentage", { required: "This field is required" })} />
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

export default EditDiscount;
