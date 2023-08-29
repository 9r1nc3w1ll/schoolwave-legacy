import ClassSelect from "./ClassSelect";
import DiscountSelect from "./DiscountSelect";
import Select from "react-select";
import { showAlert } from "@/utility_methods/alert";
import { useForm } from "react-hook-form";
import { SessionStatus, UserSession } from "@/types";
import { SetStateAction, useEffect, useState } from "react";
import { createFeeTemplate, getFeeItems } from "@/apicalls/fees";
import { useMutation, useQuery } from "react-query";

interface CreateFeeTemplateProps {
  user_session_status: SessionStatus;
  user_session: UserSession;
  exit: React.Dispatch<SetStateAction<boolean>>;
  refreshList: () => void;
}

interface OptionType {
  value: string;
  label: string;
}

const CreateFeeTemplate = (props: CreateFeeTemplateProps) => {
  const [feeItems, setFeeItems] = useState<[]>([]);
  const [requiredItem, setRequiredItem] = useState([]);
  const [optionalItem, setOptionalItem] = useState([]);
  const { register, handleSubmit, reset } = useForm({ shouldUseNativeValidation: true });
  const { data, refetch } = useQuery("feeitems", () => getFeeItems(props.user_session?.access_token), { enabled: false });

  useEffect(() => {
    if (props.user_session_status === "authenticated") {
      refetch();
    }
  }, [props.user_session_status === "authenticated"]);

  useEffect(() => {
    const refinedSeeItems: any = [];

    if (data) {
      data.data?.forEach((itm: any) => {
        itm.value = itm.id;
        itm.label = itm.name;
        refinedSeeItems.push(itm);
      });
    }

    console.log("refinedSeeitems: ", refinedSeeItems);
    setFeeItems(refinedSeeItems);
  }, [data]);

  const { mutate } = useMutation(
    (data) =>
      createFeeTemplate(props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert("success", "Session Created Successfuly");
        props.refreshList();
        props.exit(false);
        reset();
      },
      onError: (error: any) => {
        showAlert("error", error.message);
        const x = error.response.data.message.split(" ");

        if (x.indexOf("duplicate") >= 0 && x.indexOf("key") >= 0 && x.indexOf("constraint") >= 0) {
          showAlert("error", "A session with same Start Date or End Date already exist");
        } else {
          showAlert("error", "An Error Occured");
        }
      }
    }
  );

  const onSubmit = async (tempData: any) => {
    tempData.school = props.user_session?.school.id;
    tempData.required_items = requiredItem;
    tempData.optional_items = optionalItem;
    tempData.active = false;
    tempData.tax = 1;
    mutate(tempData);
  };

  return (
    <div className="">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input id="description" type="text" className="form-input" {...register("description", { required: "This field is required" })} />
        </div>
        <div>
          <ClassSelect register={register} setSelectedClass={(x: any) => x} user_session={props.user_session} triggerFetch= {props.user_session_status == "authenticated"} class_selector="class_id" />
        </div>
        <div>
          <DiscountSelect register={register} trigger={props.user_session_status == "authenticated"} user_session={props.user_session} />
        </div>
        <div>
          <label htmlFor="name">Required Fee Items</label>
          <Select placeholder="Select an option" options={feeItems} isMulti isSearchable={true} onChange={(e: any) => {
            const dataofInterest: any = [];

            e.forEach((itm: any) => { dataofInterest.push(itm.id); });
            setRequiredItem(dataofInterest);
          }} />
        </div>
        <div>
          <label htmlFor="name">Optional Fee Items</label>
          <Select placeholder="Select an option" options={feeItems} isMulti isSearchable={true} onChange={(e: any) => {
            const dataofInterest: any = [];

            e.forEach((itm: any) => { dataofInterest.push(itm.id); });
            setOptionalItem(dataofInterest);
          }} />
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

export default CreateFeeTemplate;
