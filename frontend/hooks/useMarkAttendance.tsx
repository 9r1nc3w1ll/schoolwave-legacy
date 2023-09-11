import { markBulkAttendance } from "@/apicalls/attendance";
import { AttendancePayload, AttendancePayloadTypes } from "@/models/Attendance";
import { showAlert } from "@/utility_methods/alert";
import { useSession } from "next-auth/react";
import React from "react";
import { useMutation } from "react-query";

type MarkAttendanceTypes = {
  setAttendanceState: (payload: AttendancePayloadTypes) => void;
  resetAttendanceState: () => void;
  query: Partial<AttendancePayload>;
  bulkMarkAttendance: (data: Partial<AttendancePayload>) => void;
  isMarkingAttendance: boolean;
};

const initialAttendanceState: AttendancePayload = {
  attendance_type: "Daily",
  attendee: "",
  class_id: "",
  subject: "",
  staff: "",
  date: "",
  deleted_at: "",
  start_time: "",
  end_time: "",
  present: false,
  remark: "",
  school: "",
  role: "student",
};

type AttendanceAction =
    | {
      type: "SET_FILTER";
      payload: { field: keyof AttendancePayload; value: string | number };
    }
    | { type: "RESET_STATE" };

function AttendanceReducer (state: AttendancePayload, action: AttendanceAction): AttendancePayload {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "RESET_STATE":
      return initialAttendanceState;
    default:
      return state;
  }
}

export const useMarkAttendance = (): MarkAttendanceTypes => {
  const { status: sessionStatus, data: user_session } = useSession();
  const [{ attendance_type, attendee, class_id, subject, staff, date }, dispatch] = React.useReducer(AttendanceReducer, initialAttendanceState);

  const setAttendanceState = React.useCallback(
    (payload: AttendancePayloadTypes) => {
      dispatch({ type: "SET_FILTER", payload });
    },
    [dispatch]
  );

  const resetAttendanceState = React.useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, [dispatch]);

  const query: Partial<AttendancePayload> = React.useMemo(
    () => ({
      attendance_type,
      attendee,
      class_id,
      subject,
      staff,
      date,
    }),
    [attendance_type, attendee, class_id, subject, staff, date]
  );

  const {
    mutate: bulkMarkAttendance,
    isLoading: isMarkingAttendance,
    error,
  } = useMutation(
    (data: Partial<AttendancePayload>) => {
      return markBulkAttendance(data, user_session?.access_token);
    },
    {
      onSuccess: async (data) => {
        if (!data.error) {
          showAlert("success", "Attendance saved successfuly");
        } else {
          showAlert("error", data.message);
        }
      },
      onError: (error) => {
        showAlert("error", "An Error Occured");
      },
    }
  );

  return {
    resetAttendanceState,
    setAttendanceState,
    query,
    bulkMarkAttendance,
    isMarkingAttendance,
  };
};
