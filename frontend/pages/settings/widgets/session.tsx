import { ISettings } from '@/models/Settings';
import React from 'react';
import Select from 'react-select';

interface ISessionSettings {
  query: ISettings;
  resetSettingsState: () => void;
  setSettingsState?: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SessionSettings: React.FC<ISessionSettings> = ({
  query,
  handleChange,
}) => {
  return (
    <div>
      <label className='mt-8'>Staff Code Prefix</label>
      <input
        type='text'
        className='form-input'
        onChange={handleChange}
        name='staffCodePrefix'
        value={query?.staffCodePrefix}
      />
      <label className='mt-8'>Student Code Prefix</label>
      <input
        type='text'
        className='form-input'
        onChange={handleChange}
        name='studentCodePrefix'
        value={query?.studentCodePrefix}
      />
    </div>
  );
};

export default SessionSettings;
