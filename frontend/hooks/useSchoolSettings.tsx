import React, { useEffect, useState } from "react";
import {
  ISettings,
  ISettingsNavTypes,
  ISettingsPayload,
  SettingsPayloadTypes,
} from "@/models/Settings";
import { useMutation, useQuery } from "react-query";
import { getSchoolSettings, updateSettings } from "@/apicalls/settings";
import { useSession } from "next-auth/react";
import { showAlert } from "@/utility_methods/alert";
import { IClientError } from "@/types";

type ISettingsTypes = ISettings & ISettingsNavTypes;

const initialSettingState: ISettingsTypes = {
  logo: { file: "" },
  brand: {
    primaryColor: "",
    secondaryColor: "",
  },
  schoolId: "",
  schoolName: "",
  schoolRadius: 0,
  schoolLatitude: 0,
  storageOptions: {
    token: "",
    driver: "",
    default: false,
    basePath: "",
  },
  schoolLongitude: 0,
  staffCodePrefix: "",
  studentCodePrefix: "",
  activeTab: "basic",
};

type SettingsAction =
  | {
    type: "SET_FILTER";
    payload: { field: keyof ISettings; value: string | number };
  }
  | {
    type: "SET_ACTIVE_TAB";
    payload: ISettingsNavTypes;
  }
  | {
    type: "SET_STATE";
    payload: ISettingsTypes;
  }
  | { type: "RESET_STATE" };

function SettinsReducer (
  state: ISettingsTypes,
  action: SettingsAction
): ISettingsTypes {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "SET_ACTIVE_TAB":
      return {
        ...state,
        activeTab: action.payload.activeTab,
      };
    case "SET_STATE":
      return action.payload;
    case "RESET_STATE":
      return initialSettingState;
    default:
      return state;
  }
}

export const useSettings = () => {
  const [fetchedSettings, setFectchedSettings] =
    useState<ISettingsTypes>(initialSettingState);

  const [
    {
      logo,
      brand,
      schoolId,
      schoolLatitude,
      schoolLongitude,
      schoolName,
      schoolRadius,
      staffCodePrefix,
      storageOptions,
      studentCodePrefix,
      activeTab,
    },
    dispatch,
  ] = React.useReducer(SettinsReducer, fetchedSettings);

  const setSettingsState = React.useCallback(
    (payload: SettingsPayloadTypes) => {
      dispatch({ type: "SET_FILTER", payload });
    },
    [dispatch]
  );

  const setActiveTab = React.useCallback(
    (activeTab: "basic" | "session" | "email") => {
      dispatch({ type: "SET_ACTIVE_TAB", payload: { activeTab } });
    },
    [dispatch]
  );

  const setState = React.useCallback(
    (payload: ISettingsTypes) => {
      dispatch({ type: "SET_STATE", payload });
    },
    [dispatch]
  );

  const resetSettingsState = React.useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, [dispatch]);

  const query: ISettingsTypes = React.useMemo(
    () => ({
      logo,
      brand,
      schoolId,
      schoolLatitude,
      schoolLongitude,
      schoolName,
      schoolRadius,
      staffCodePrefix,
      storageOptions,
      studentCodePrefix,
      activeTab,
    }),
    [
      logo,
      brand,
      schoolId,
      schoolLatitude,
      schoolLongitude,
      schoolName,
      schoolRadius,
      staffCodePrefix,
      storageOptions,
      studentCodePrefix,
      activeTab,
    ]
  );

  const { data: userSession } = useSession();

  const {
    data: settingsConfig,
    isSuccess,
    isFetching: isLoadingSettingsConfig,
  } = useQuery(
    "fetch-settings",
    () =>
      getSchoolSettings(userSession?.access_token!, userSession?.school?.id),
    { enabled: true }
  );

  useEffect(() => {
    if (settingsConfig && isSuccess) {
      const defaultState: ISettingsTypes = {
        logo: { file: settingsConfig?.logo?.file },
        brand: {
          primaryColor: settingsConfig?.brand?.primary_color,
          secondaryColor: settingsConfig?.brand?.secondary_color,
        },
        schoolId: settingsConfig?.school_id,
        schoolName: settingsConfig?.school_name,
        schoolRadius: settingsConfig?.school_radius,
        schoolLatitude: settingsConfig?.school_latitude,
        storageOptions: {
          token: settingsConfig?.storage_options?.token,
          driver: settingsConfig?.storage_options?.driver,
          default: settingsConfig?.storage_options?.default,
          basePath: settingsConfig?.storage_options?.base_path,
        },
        schoolLongitude: settingsConfig?.school_longitude,
        staffCodePrefix: settingsConfig?.staff_code_prefix,
        studentCodePrefix: settingsConfig?.student_code_prefix,
        activeTab: "basic",
      };
      setState(defaultState);
    }
  }, [isSuccess, setState, settingsConfig]);

  const { mutate: saveSettings, isLoading: isSavingSettings } = useMutation(
    (data: ISettingsPayload) => {
      return updateSettings(
        data,
        userSession?.access_token,
        userSession?.school?.id
      );
    },
    {
      onSuccess: async () => {
        showAlert("success", "Settings Saved successfuly");
      },
      onError: (error: IClientError) => {
        showAlert("error", error.message);
      },
    }
  );

  return {
    query,
    resetSettingsState,
    setSettingsState,
    setActiveTab,
    isLoadingSettingsConfig,
    saveSettings,
    isSavingSettings,
  };
};
