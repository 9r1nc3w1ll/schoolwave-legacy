import { getDiscounts } from "@/apicalls/fees";
import { useQuery } from "react-query";
import { DiscountTypes, UserSession } from "@/types";
import React, { useEffect, useState } from "react";

interface DiscountSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  trigger: boolean;
  user_session: UserSession;
}

const DiscountSelect = React.forwardRef<HTMLSelectElement, DiscountSelectProps>(({ user_session: userSession, trigger }, ref) => {
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
    <select placeholder="Discount" className="form-input"
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
});

export default DiscountSelect;
