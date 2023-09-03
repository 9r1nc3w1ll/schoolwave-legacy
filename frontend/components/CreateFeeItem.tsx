import DiscountSelect from "./DiscountSelect";
import { Loader } from "@mantine/core";
import { SetStateAction } from "react";
import { createFeeItem } from "@/apicalls/fees";
import { showAlert } from "@/utility_methods/alert";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { FeeItemFormValues, IClientError, SessionStatus, UserSession } from "@/types";

interface CreateFeeItemProps {
  user_session_status: SessionStatus;
  user_session: UserSession;
  exit: React.Dispatch<SetStateAction<boolean>>;
  refreshList: () => void;
}

const CreateFeeItem = (props: CreateFeeItemProps) => {
  const { register, handleSubmit, reset } = useForm<FeeItemFormValues>({ shouldUseNativeValidation: true });

  const { mutate, isLoading } = useMutation(
    createFeeItem,
    {
      onSuccess: async () => {
        showAlert("success", "Session Created Successfuly");
        props.refreshList();
        props.exit(false);
        reset();
      },
      onError: (error: IClientError) => {
        showAlert("error", error.message);
      }
    }
  );

  const onSubmit = handleSubmit(async (tempData) => {
    mutate({
      data: {
        name: tempData.name,
        description: tempData.description,
        amount: tempData.amount,
        discount: tempData.discount,
        school: props.user_session?.school?.id,
      },
      accessToken: props.user_session.access_token
    });
  });

  return (
    <div className="">
      <form className="space-y-5" onSubmit={onSubmit}>

        <div>
          <input id="name" type="text" placeholder="Name" className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <input id="description" type="text" placeholder="Description" className="form-input" {...register("description")} />
        </div>
        <div>
          <DiscountSelect register={register} trigger={props.user_session_status === "authenticated"} user_session={props.user_session} />
        </div>
        <div>

          <input id="amount" type="number" placeholder="Amount" className="form-input" {...register("amount", { required: "This field is required" })} />
        </div>
        <div className="flex justify-center items-center mt-8 mx-auto">

          <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
            {isLoading && <Loader color="gray" size="sm" className="mr-3" />}Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFeeItem;
