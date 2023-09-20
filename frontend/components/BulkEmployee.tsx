import UploadFile from "./UploadFile";
import { bulkEmployeeUpload } from "@/apicalls/staffs";
import { useMutation } from "react-query";
import { IClientError, UserSession } from "@/types";
import React, { SetStateAction } from "react";
import { showAlert, showPrompt } from "@/utility_methods/alert";

type BulkEmployeePropsType = {
  userSession: UserSession;
  closeModal: React.Dispatch<SetStateAction<boolean>>;
  refreshAdmission: () => void;
};

export default function BulkEmployee (props: BulkEmployeePropsType) {
  const checkFile = (file: File) => file.type === "text/csv";

  const { mutate } = useMutation(bulkEmployeeUpload,
    {
      onSuccess: async () => {
        showAlert("success", "File Uploaded Successfully");
        props.refreshAdmission();
        props.closeModal(false);
      },
      onError: (error: IClientError) => {
        showAlert("error", error.message);
        props.closeModal(false);
      }
    }
  );

  const handleUpload = (file: File) => {
    if (checkFile(file)) {
      showPrompt("success", `${file.name}`, "CSV file selected, click continue to upload employees", "Upload File", () => {
        const formData = new FormData();

        formData.append("school_id", props.userSession.school.id);
        formData.append("csv", file);

        mutate({ data: formData, accessToken: props.userSession?.access_token });
      });
    } else {
      showAlert("error", `${file.name} is not a supported file type`);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-xl mb-6 text-primary">Bulk Employee Upload</h1>
      <UploadFile useFile={handleUpload} />
      <p className="text-sm text-black-100 mt-3"> Click here to download sample template</p>
    </div>
  );
}
