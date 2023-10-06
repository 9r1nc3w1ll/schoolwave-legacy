import { AssignUserToClass } from '@/apicalls/class-api';
import { Avatar } from '@mantine/core';
import CheckboxWithState from './CheckboxWithState';
import Select, { GroupBase, OptionsOrGroups } from 'react-select';
import { getAllStaff } from '@/apicalls/staffs';
import { getFirstLetters } from '@/helpers/api';
import { getStudentsWithoutClass } from '@/apicalls/users';
import { showAlert } from '@/utility_methods/alert';
import {
  ClassUserAssignmentProps,
  GetAllStaffType,
  GetClassStudentMembersResponse,
  IClientError,
  IStudentsWithoutClass,
  ResponseInterface,
} from '@/types';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type UserType = GetClassStudentMembersResponse &
  GetAllStaffType &
  IStudentsWithoutClass;

const AssignStudentsToClass = (props: ClassUserAssignmentProps) => {
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<UserType[]>([]);
  const [selectedOption, setSelectedOption] = useState<number>();

  const {
    data: students,
    isSuccess,
    isLoading,
  } = useQuery('getUsers', async () => {
    const api = props.student ? getStudentsWithoutClass : getAllStaff;
    return api(props.user_session?.access_token);
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation(AssignUserToClass, {
    onSuccess: async () => {
      showAlert('success', 'User assigned to class Successfuly');
      queryClient.invalidateQueries(['getStaff']);
      props.refreshClasses();
    },
    onError: (error: IClientError) => {
      showAlert('error', error.message);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setItems((students as any).data);
    }
  }, [isSuccess, students, props.student]);

  const [filteredItems, setFilteredItems] = useState<UserType[]>(items);

  useEffect(() => {
    if (!items?.length) {
      return;
    }
    const filterFunction = (item: UserType) => {
      const firstName = props.student
        ? item?.student_info?.first_name
        : item?.user_info?.first_name;
      const lastName = props.student
        ? item?.student_info?.last_name
        : item?.user_info?.last_name;
      const fullName = `${firstName} ${lastName}`.toLowerCase();

      return fullName.includes(search.toLowerCase());
    };

    setFilteredItems(items.filter(filterFunction));
  }, [search, items, props.student]);

  const roles = [
    { value: 'Class Teacher', label: 'Class Teacher' },
    { value: 'Staff Assistant', label: 'Staff Assistant' },
    { value: 'Counselor', label: 'Counselor' },
  ];

  return (
    <div className='mb-5 mt-8 min-h-[60vh] space-y-5 overflow-y-auto'>
      <form className='mx-auto mb-5 w-full sm:w-1/2'>
        <div className='relative'>
          <input
            type='text'
            value={search}
            placeholder={`Search ${
              props.student ? 'Students' : 'Employees'
            } ...`}
            className='form-input h-11 rounded-full bg-white shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] placeholder:tracking-wider ltr:pr-11 rtl:pl-11'
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type='button'
            className='btn btn-primary absolute inset-y-0 m-auto flex h-9 w-9 items-center justify-center rounded-full p-0 ltr:right-1 rtl:left-1'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
              />
            </svg>
          </button>
        </div>
      </form>
      <div>
        <div className='block w-full  space-y-4 p-4'>
          {filteredItems ? (
            filteredItems.map((item: UserType, i: number) => {
              return (
                <div
                  key={item.id}
                  className='mx-auto grid w-[90%] grid-cols-2 items-center gap-10 rounded-xl border bg-white p-3
                        font-semibold text-gray-500 transition-all duration-300 hover:scale-[1.01] hover:text-primary dark:bg-[#1b2e4b]'
                >
                  <div className='user-profile flex items-center gap-8'>
                    {/* <img src={`/assets/images/profile-${Math.round(Math.random() * 35)}.jpeg`} alt="img" className="w-8 h-8 rounded-md object-cover" /> */}
                    <Avatar color='cyan' radius='xl'>
                      {getFirstLetters(
                        `${
                          props.student
                            ? item?.first_name
                            : item?.user_info?.first_name
                        } ${
                          props.student
                            ? item?.last_name
                            : item?.user_info?.last_name
                        }`
                      )}
                    </Avatar>
                    <div>
                      {(props.student
                        ? item?.first_name
                        : item?.user_info?.first_name) +
                        ' ' +
                        (props.student
                          ? item?.student_info?.last_name
                          : item?.user_info?.last_name)}
                    </div>
                  </div>
                  <div className='w-full'>
                    {!props.student ? (
                      <Select
                        placeholder='Select a Role'
                        options={
                          roles as OptionsOrGroups<
                            {
                              label: string;
                              value: string;
                            },
                            GroupBase<{
                              label: string;
                              value: string;
                            }>
                          >
                        }
                        isSearchable={false}
                        onChange={(e) => {
                          const data = {
                            user: item?.user,
                            class_id: props.classData.id,
                            role: e?.value,
                          };

                          mutate({
                            data: {
                              ...data,
                              role: data?.role ?? '',
                              school: props?.user_session?.school?.id,
                            },
                            accessToken: props.user_session?.access_token,
                          });
                        }}
                        onFocus={() => {
                          setSelectedOption(i);
                        }}
                        onBlur={() => {
                          setSelectedOption(-5);
                        }}
                        className={`${
                          selectedOption === i - 1 || selectedOption === i - 2
                            ? 'hidden'
                            : ''
                        }`}
                      />
                    ) : (
                      <CheckboxWithState
                        click={() => {
                          const data = {
                            user: item?.id,
                            class_id: props.classData.id,
                            role: 'student',
                          };

                          mutate({
                            data: {
                              ...data,
                              school: props?.user_session?.school?.id,
                            },
                            accessToken: props?.user_session?.access_token,
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>{`${isLoading ? 'Loading items ...' : 'xxx'}`}</p>
          )}
        </div>
      </div>
      {/* <button onClick={props.closeIt(false)}>Done</button> */}
    </div>
  );
};

export default AssignStudentsToClass;
