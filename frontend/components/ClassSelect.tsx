import { getClasses } from "@/apicalls/class-api";
import { useEffect } from "react";
import { useQuery } from "react-query";

const ClassSelect = (props: any) => {
  const { data: classes, isSuccess: classgotten, refetch } = useQuery("getClasses", () => {
    return getClasses(props.user_session?.access_token);
  }, { enabled: false });

  useEffect(() => {
    refetch();
  }, [props.triggerFetch]);

  return (
    <div className="mb-8">
      <label>Class</label>
      <select className="form-select text-white-dark" id="class" {...props.register(`${props.class_selector ? props.class_selector : "class"}`, { required: "This field is required" })}
      >
        <option>-- select One-- </option>
        {classes?.map((clss: any) => <option key={clss.id} value={clss.id}> {clss.name} </option>)}
      </select>
    </div>
  );
};

export default ClassSelect;
