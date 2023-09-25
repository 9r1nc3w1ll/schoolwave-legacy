import { ISettings } from '@/models/Settings';
import React, { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import ImageUploading, { ImageListType } from 'react-images-uploading';

interface IBasicSettings {
  query: ISettings;
  resetSettingsState: () => void;
  setSettingsState: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  //   register: UseFormRegister<ISettings>;
}
const BasicSettings: React.FC<IBasicSettings> = ({
  query,
  setSettingsState,
  resetSettingsState,
  handleChange,
  //   register,
}) => {
  const [images, setImages] = useState<any>([query?.logo.file]);
  const maxNumber = 69;
  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList as never[]);
  };

  return (
    <div>
      <div className='mb-3 flex flex-col sm:flex-row'>
        <label
          htmlFor='horizontalEmail'
          className='mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2'
        >
          School Name
        </label>
        <input
          id='School Name'
          type='text'
          placeholder='School Name'
          className='form-input flex-1'
          onChange={handleChange}
          name='schoolName'
          value={query?.schoolName}
        />
      </div>
      <div className='mb-3 flex flex-col sm:flex-row'>
        <label
          htmlFor='schoolRadius'
          className='mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2'
        >
          School Radius
        </label>
        <input
          id='radius'
          type='text'
          className='form-input flex-1'
          onChange={handleChange}
          name='schoolRadius'
          value={query?.schoolRadius}
        />
      </div>
      <div className='mb-3 flex flex-col sm:flex-row'>
        <label
          htmlFor='latitude'
          className='mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2'
        >
          School Latitude
        </label>
        <input
          id='latitude'
          type='text'
          className='form-input flex-1'
          onChange={handleChange}
          name='schoolLatitude'
          value={query?.schoolLatitude}
        />
      </div>
      <div className='mb-3 flex flex-col sm:flex-row'>
        <label
          htmlFor='longitude'
          className='mb-0 rtl:ml-2 sm:w-1/4 sm:ltr:mr-2'
        >
          School Longitude
        </label>
        <input
          id='longitude'
          type='text'
          className='form-input flex-1'
          onChange={handleChange}
          name='schoolLongitude'
          value={query?.schoolLongitude}
        />
      </div>
    </div>
  );
};

export default BasicSettings;
