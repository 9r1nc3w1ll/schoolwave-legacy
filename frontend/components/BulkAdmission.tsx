import { showAlert, showPrompt } from "@/utility_methods/alert";
import UploadFile from "./UploadFile";
import { useMutation } from "react-query";
import { BulkAdmissionUpload } from "@/apicalls/admissions";

export default function BulkAdmission(props:any){

  const checkFile = (file: any) => file.type === "text/csv"

  const { mutate, isLoading, error } = useMutation(
    (data:any) =>{
   
      return BulkAdmissionUpload( data, props.user_session?.access_token)},
    {
      onSuccess: async (data) => {
        if(!data.error){
          showAlert('success', 'File Uploaded Successfully')
          props.refreshAdmission()
          props.closeModal(false)
        }else{
          showAlert('error', 'An error occured with the upload')
        }

      },
      onError: (error:any) => {
        
        showAlert('error', 'An Error Occured' )
        props.closeModal
      }
    }
  );

  const handleUpload = (file:any)=>{
    if(checkFile(file)){
      showPrompt('success', `${file.name}`, 'CSV file selected, click continue to upload Admission', 'Upload File', ()=> 
      {
        const formData = new FormData

        formData.append("school_id", props.user_session.school.id);
        formData.append("csv", file);
        
    
        mutate(formData)
      } )
    }else{
      showAlert('error', `${file.name} is not a supported file type`)
    }
  }
  return(
    <div className="text-center">
      <h1 className="text-xl mb-6 text-primary">Bulk Admission Upload</h1>
      <UploadFile useFile={handleUpload}  />
      <p className="text-sm text-black-100 mt-3"> Click here to download sample template</p>
    </div>
  )
}