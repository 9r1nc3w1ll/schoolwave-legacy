import { showAlert } from "@/utility_methods/alert";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { IClientError, UserSession } from "@/types";
import React, { SetStateAction } from "react";
import { createStaffRole } from "@/apicalls/staffs";

interface CreateStaffRoleProps {
  accessToken: string;
  close: React.Dispatch<SetStateAction<boolean>>;
  refreshList: () => void;
}

type CreateStaffRoleFormValues = {
  name: string;
  description: string;
}

const CreateStaffRole = (props: CreateStaffRoleProps) => {
  const { register, handleSubmit, reset } = useForm<CreateStaffRoleFormValues>({
    shouldUseNativeValidation: true,
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const { mutate } = useMutation(createStaffRole,
    {
      onSuccess: () => {
        showAlert("success", "Staff Role Created Successfuly");
        props.refreshList();
        props.close(false);
        reset();
      },
      onError: (error: IClientError) => {
        showAlert("error", error.message);
      }
    }
  );

  const onSubmit = handleSubmit(async (tempData) => {
    mutate({
      data: tempData,
      accessToken: props.accessToken
    });
  });

  return (
    <div className="">
      <form className="space-y-5" onSubmit={onSubmit}>
        <h1>Create Employee Role</h1>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input id="description" type="text" className="form-input" {...register("description", { required: false })} />
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

export default CreateStaffRole;
