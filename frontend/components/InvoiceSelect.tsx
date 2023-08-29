import { CreateTransactionFormvalues } from "./CreateTransaction";
import { Session } from "next-auth/core/types";
import { getInvoices } from "@/apicalls/fees";
import { useQuery } from "react-query";
import { InvoiceTypes, SessionStatus } from "@/types";
import React, { useEffect, useState } from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";

interface InvoiceSelectProps {
  watch: UseFormWatch<CreateTransactionFormvalues>;
  register: UseFormRegister<CreateTransactionFormvalues>;
  user_session_status: SessionStatus;
  user_session: Session | null;
}

const InvoiceSelect = (props: InvoiceSelectProps) => {
  const [invoices, setInvoices] = useState<InvoiceTypes[]>([]);
  const { data, isLoading, refetch } = useQuery("getInvoices", () => getInvoices(props.user_session?.access_token as string), { enabled: false });

  useEffect(() => {
    if (props.user_session_status === "authenticated") {
      refetch();
    }
  }, [props.user_session_status === "authenticated"]);

  useEffect(() => {
    if (data) {
      setInvoices(data.data);
    }
  }, [data]);

  return (
    <>
      <label>Invoice</label>
      <select placeholder="Fee Template" className="form-input" {...props.register("invoice_id")}
        onClick={() => {
          refetch();
        }}>
        <option>-- Select invoice --</option>
        {isLoading
          ? <option>Loading ...</option>
          : invoices?.map((invoice) => <option key={invoice.id} value={invoice.id} >{invoice.id}</option>)
        }
      </select>
    </>
  );
};

export default InvoiceSelect;
