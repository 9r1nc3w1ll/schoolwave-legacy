import { AssignStaffToSubject, getSingleSubject } from '@/api-calls/subjects';
import { getAllStaff } from '@/api-calls/staffs';
import { getRoles } from '@/api-calls/roles';
import { showAlert } from '@/utility_methods/alert';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Select from 'react-select';
import { active } from 'sortablejs';
import CheckboxWithState from './CheckboxWithState';
import Option from 'react-select/dist/declarations/src/components/Option';
import { AnyARecord } from 'dns';
import { GetAllStaffType } from '@/types';

const SubjectUserAssignments = (props: any) => {
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<GetAllStaffType[]>([]);
  const [roles, setRoles] = useState<{ value: string }[]>([]);
  const {
    data: staffsDetails,
    isSuccess: teachersSuccess,
    isLoading: teachersLoading,
    refetch: refetchTeacher,
  } = useQuery('getAllStaff', async () => {
    return getAllStaff(props.user_session.access_token);
  });
  const {
    data: roleDetails,
    isSuccess: rolesSuccess,
    isLoading: rlesLoading,
    refetch: refetchRole,
  } = useQuery('getAllRoles', async () => {
    return getRoles(props.user_session.access_token);
  });

  const queryClient = useQueryClient();

  const { mutate, error } = useMutation(
    (data: any) => AssignStaffToSubject(data, props.user_session.access_token),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Staff assigned to subject successfully');
        queryClient.invalidateQueries('AssignStafftoSubeject');
        props.refreshClasses();
        props.exit(false);
      },
      onError: (error: any) => {
        showAlert('error', 'An Error Occurred');
      },
    }
  );

  useEffect(() => {
    if (teachersSuccess && rolesSuccess) {
      // setItems(teachersData);
      refetchTeacher();
      refetchRole();
      setItems(staffsDetails), setRoles(roleDetails);
    }
  }, [teachersSuccess, staffsDetails]);

  let options: any = [];
  let roles_option: any = [];

  if (teachersSuccess && rolesSuccess) {
    options = items.map((item: any) => ({
      label: `${item.user_info.first_name} ${item.user_info.last_name}`,
      value: item.id,
    }));

    roles_option = roles.map((role: any) => ({
      label: role.name,
      value: role.id,
    }));
  }

  const [staffValue, setStaffValue] = useState(null);
  const [roleValue, setRoleValue] = useState(null);

  const handleStaffChange = (selectedOption: any) => {
    setStaffValue(selectedOption);
  };

  const handleRoleChange = (selectedOption: any) => {
    setRoleValue(selectedOption);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    let data = {
      subject: props.classData.id,
      subject_name: props.classData.name,
      staff: (staffValue as any)?.value,
      role: (roleValue as any)?.value,
      active: true,
    };

    // Additional logic to handle the selected optio

    mutate(data);
  };

  const defaultValue = options.length > 0 ? options[0] : null;
  const defaultRole = roles_option.length > 0 ? roles_option[0] : null;

  return (
    <div className='mb-5 mt-8 min-h-[30vh] space-y-5  overflow-y-auto'>
      <div className=' w-full border-b'>
        <p className='p-2  text-left text-base'>
          {' '}
          Assign a Staff to:{' '}
          <span className='font-bold text-blue-600'>
            {props.classData.name}
          </span>{' '}
        </p>
      </div>

      <div className='w-full  p-4 '>
        <form onSubmit={handleSubmit} className='mx-auto w-full max-w-lg'>
          <div className='mb-5 flex items-center gap-4 rounded-xl border bg-white p-3 dark:bg-[#1b2e4b]'>
            <div className='user-profile font-semibold'>Staff:</div>
            <div className='w-full'>
              <Select
                value={staffValue}
                options={options}
                isSearchable={false}
                defaultValue={defaultValue}
                onChange={handleStaffChange}
              />
            </div>
          </div>

          <div className='mb-5 flex items-center gap-4 rounded-xl border bg-white p-3 dark:bg-[#1b2e4b]'>
            <label htmlFor='role' className='user-profile font-semibold'>
              Role:
            </label>
            <div className='w-full'>
              <Select
                id='staff'
                value={roleValue}
                options={roles_option}
                isSearchable={false}
                defaultValue={defaultRole}
                onChange={handleRoleChange}
              />
            </div>
          </div>

          <div className='flex justify-center'>
            <button className='btn btn-primary' type='submit'>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectUserAssignments;
