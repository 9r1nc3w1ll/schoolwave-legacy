import { Session } from "next-auth/core/types";
import { getClasses } from "@/apicalls/class-api";
import React, { useEffect } from "react";
import { useQuery } from "react-query";

interface ClassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  triggerFetch: boolean;
  user_session: Session | null;
}

const ClassSelect = React.forwardRef<HTMLSelectElement, ClassSelectProps>(({ triggerFetch, user_session, ...rest  }, ref) => {
  const { data: classes, refetch } = useQuery("getClasses", () => {
    return getClasses(user_session?.access_token);
  }, { enabled: false });

  useEffect(() => {
    refetch();
  }, [triggerFetch]);

  return (
    <div className="mb-8">
      <label>Class</label>
      <select className="form-select text-white-dark" id="class" ref={ref} {...rest}
      >
        <option>-- select One-- </option>
        {classes?.map((clss) => <option key={clss.id} value={clss.id}> {clss.name} </option>)}
      </select>
    </div>
  );
});

export default ClassSelect;
