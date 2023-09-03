import { getDiscounts } from "@/apicalls/fees";
import { useQuery } from "react-query";
import { DiscountTypes, UserSession } from "@/types";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { useEffect, useState } from "react";

interface DiscountSelectProps<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  trigger: boolean;
  user_session: UserSession;
}

const DiscountSelect = <TFieldValues extends FieldValues>({ user_session: userSession, trigger, register }: DiscountSelectProps<TFieldValues>) => {
  const [discounts, setDiscount] = useState<DiscountTypes[]>([]);
  const { data, isLoading, refetch } = useQuery("feediscounts", () => getDiscounts(userSession?.access_token), { enabled: false });

  useEffect(() => {
    if (trigger) {
      refetch();
    }
  }, [trigger]);

  useEffect(() => {
    if (data) {
      setDiscount(data);
    }
  }, [data]);

  return (
    <select placeholder="Discount" className="form-input" {...(register && register("discount"))}
      onClick={() => {
        refetch();
      }}>
      <option>Discounts</option>
      {isLoading
        ? <option>Loading ...</option>
        : discounts.map((disc) => <option key={disc.id} value={disc.id} >{disc.name}</option>)
      }
    </select>
  );
};

export default DiscountSelect;
