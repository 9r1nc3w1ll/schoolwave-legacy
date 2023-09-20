import { IClientError } from "@/types";
import React from "react";
import { markBulkAttendance } from "@/apicalls/attendance";
import { showAlert } from "@/utility_methods/alert";
import { useMutation } from "react-query";
import { useSession } from "next-auth/react";
import { AttendancePayload, AttendancePayloadTypes, RemarkActionTypes } from "@/models/Attendance";

type MarkAttendanceTypes = {
  setAttendanceState: (payload: AttendancePayloadTypes) => void;
  resetAttendanceState: () => void;
  query: Partial<AttendancePayload>;
  bulkMarkAttendance: (data: Partial<AttendancePayload>) => void;
  isMarkingAttendance: boolean;
  addRemark: (payload: RemarkActionTypes) => void;
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
  present: [],
  remark: [],
  school: "",
  role: "student",
  student: [],
};

type AttendanceAction =
    | {
      type: "SET_FILTER";
      payload: { field: keyof AttendancePayload; value: string | number };
    }
    | {
      type: "ADD_REMARK";
      payload: RemarkActionTypes;
    }
    | { type: "RESET_STATE" };

function AttendanceReducer (state: AttendancePayload, action: AttendanceAction): AttendancePayload {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "ADD_REMARK":

      if ("index" in action.payload && "remark" in action.payload && "studentID" in action.payload) {
        const { index, remark, studentID } = action.payload;

        if (index >= 0) {
          // Clone the remarks and present arrays
          const updatedRemarks = [...state.remark];
          const updatedPresent = [...state.present];
          const updatedStudents = [...state.student];

          updatedRemarks[index] = remark;
          updatedPresent[index] = ["Late", "Punctual"].includes(remark) ?? false;
          updatedStudents[index] = studentID;

          return {
            ...state,
            remark: updatedRemarks,
            present: updatedPresent,
            student: updatedStudents,
          };
        }
      }

      return state;
    case "RESET_STATE":
      return initialAttendanceState;
    default:
      return state;
  }
}

export const useMarkAttendance = (): MarkAttendanceTypes => {
  const { data: userSession } = useSession();
  const [{ attendance_type: attendanceType, attendee, class_id: classId, subject, staff, date, present, remark, student }, dispatch] = React.useReducer(AttendanceReducer, initialAttendanceState);

  const setAttendanceState = React.useCallback(
    (payload: AttendancePayloadTypes) => {
      dispatch({ type: "SET_FILTER", payload });
    },
    [dispatch]
  );

  const addRemark = React.useCallback(
    (payload: RemarkActionTypes) => {
      dispatch({ type: "ADD_REMARK", payload });
    },
    [dispatch]
  );

  const resetAttendanceState = React.useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, [dispatch]);

  const query: Partial<AttendancePayload> = React.useMemo(
    () => ({
      attendance_type: attendanceType,
      attendee,
      class_id: classId,
      subject,
      staff,
      date,
      present,
      remark,
      student,
    }),
    [attendanceType, attendee, classId, subject, staff, date, present, remark, student]
  );

  const {
    mutate: bulkMarkAttendance,
    isLoading: isMarkingAttendance,
  } = useMutation(
    (data: Partial<AttendancePayload>) => {
      return markBulkAttendance(data, userSession?.access_token);
    },
    {
      onSuccess: async () => {
        showAlert("success", "Attendance saved successfuly");
      },
      onError: (error: IClientError) => {
        showAlert("error", error.message);
      },
    }
  );

  return {
    resetAttendanceState,
    setAttendanceState,
    query,
    bulkMarkAttendance,
    isMarkingAttendance,
    addRemark,
  };
};
