import { showAlert, showPrompt } from '@/utility-methods/alert';
import UploadFile from './UploadFile';
import { useMutation } from 'react-query';
import { BulkAdmissionUpload } from '@/api-calls/admissions';

export default function BulkAdmission(props: any) {
  const checkFile = (file: any) => file.type === 'text/csv';

  const { mutate, isLoading, error } = useMutation(
    (data: FormData) => {
      return BulkAdmissionUpload(data, props.user_session?.access_token);
    },
    {
      onSuccess: async (data) => {
        if (!data.error) {
          showAlert('success', 'File Uploaded Successfully');
          props.refreshAdmission();
          props.closeModal(false);
        } else {
          showAlert('error', data.message);
        }
      },
      onError: (error: any) => {
        showAlert('error', 'An Error Occured');
        props.closeModal;
      },
    }
  );

  const handleUpload = (file: any) => {
    if (checkFile(file)) {
      showPrompt(
        'success',
        `${file.name}`,
        'CSV file selected, click continue to upload Admission',
        'Upload File',
        () => {
          const formData = new FormData();

          formData.append('school_id', props.user_session.school.id);
          formData.append('csv', file);

          mutate(formData);
        }
      );
    } else {
      showAlert('error', `${file.name} is not a supported file type`);
    }
  };
  return (
    <div className='text-center'>
      <h1 className='mb-6 text-xl text-primary'>Bulk Admission Upload</h1>
      <UploadFile useFile={handleUpload} />
      <a
        href='https://firebasestorage.googleapis.com/v0/b/lunar-c17b7.appspot.com/o/schoolwave-example-csv%2Fsample_admission_requests.csv?alt=media&token=bcca5789-1734-4bb0-b936-e20323186fb0'
        className='text-black-100 mt-3 text-sm'
      >
        {' '}
        Click here to download sample template
      </a>
    </div>
  );
}
