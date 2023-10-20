import { showAlert, showPrompt } from '@/utility_methods/alert';
import UploadFile from './UploadFile';
import { useMutation } from 'react-query';
import { BulkSubjectsUpload } from '@/api-calls/subjects';

export default function BulkAdmission(props: any) {
  const checkFile = (file: any) => file.type === 'text/csv';

  const { mutate, isLoading, error } = useMutation(
    (data: any) => {
      return BulkSubjectsUpload(data, props.user_session?.access_token);
    },
    {
      onSuccess: async (data) => {
        showAlert('success', 'File Uploaded Successfully');
        props.closeModal(false);
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
        'info',
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
      <h1 className='mb-6 text-xl text-primary'>Bulk Subjects Upload</h1>
      <UploadFile useFile={handleUpload} />
      <p className='text-black-100 mt-3 text-sm'>
        {' '}
        Click here to download sample template
      </p>
    </div>
  );
}
