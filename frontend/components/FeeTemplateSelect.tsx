import { CreateInvoiceFormvalues } from "./CreateInvoice";
import { getFeeTemplates } from "@/apicalls/fees";
import { useQuery } from "react-query";
import { FeeTemplateInterface, SessionStatus, UserSession } from "@/types";
import React, { SetStateAction, useEffect, useState } from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";

interface FeeTemplateSelectProps {
  setItems: React.Dispatch<SetStateAction<string[]>>;
  watch: UseFormWatch<CreateInvoiceFormvalues>;
  register: UseFormRegister<CreateInvoiceFormvalues>;
  user_session_status: SessionStatus;
  user_session: UserSession;
}

const FeeTemplateSelect = (props: FeeTemplateSelectProps) => {
  const [feeTemplates, setFeeTemplates] = useState<FeeTemplateInterface[]>([]);
  const { data, isLoading, refetch } = useQuery("feetemplatess", () => getFeeTemplates(props.user_session.access_token), { enabled: false });

  useEffect(() => {
    if (props.user_session_status === "authenticated") {
      refetch();
    }
  }, [props.user_session_status === "authenticated"]);

  useEffect(() => {
    if (data) {
      console.log(data.data);
      setFeeTemplates(data.data);
    }
  }, [data]);

  React.useEffect(() => {
    const subscription = props.watch(({ template }) => {
      console.log("template: ", template);
      let templateItems: string[] = [];

      console.log("discounts: ", feeTemplates);

      feeTemplates.forEach((item) => {
        console.log("item: ", item);

        if (item.id === template) {
          templateItems = item.optional_items.concat(item.required_items);
          console.log("values: ", item.optional_items.concat(item.required_items));
        }
      });
      props.setItems(templateItems);
    });

    return () => subscription.unsubscribe();
  }, [props.watch, feeTemplates]);

  useEffect(() => {
    console.log("discountssssss: ", feeTemplates);
  }, [feeTemplates]);

  return (
    <>
      <label>Fee Template</label>
      <select placeholder="Fee Template" className="form-input" {...props.register("template")}
        onClick={() => {
          refetch();
        }}>
        <option>-- Select template --</option>
        {isLoading
          ? <option>Loading ...</option>
          : feeTemplates?.map((feeTemplate: FeeTemplateInterface) => <option key={feeTemplate.id} value={feeTemplate.id} >{feeTemplate.name}</option>)
        }
      </select>
    </>
  );
};

export default FeeTemplateSelect;
