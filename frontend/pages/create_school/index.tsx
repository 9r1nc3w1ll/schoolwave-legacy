import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { downloadExcel } from 'react-export-table-to-excel';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useMutation, useQuery } from 'react-query';
import { getParents } from '@/apicalls/users';
import { useRouter } from 'next/router';
import CreateAdmission from '@/components/CreateAdmission';
import { Dialog, Transition } from '@headlessui/react';
import EditParent from '@/components/EditParent';
import { useSession } from 'next-auth/react';
import { getAdmissions, updateAdmission } from '@/apicalls/admissions';
import { formatDate } from '@/utility_methods/datey';
import { showAlert } from '@/utility_methods/alert';
import { useDispatch } from 'react-redux';
import CreateSchool from '@/components/CreateSchool';
import { getSchools } from '@/apicalls/schools';

const col = [
  'id',
  'firstName',
  'lastName',
  'company',
  'age',
  'dob',
  'email',
  'phone',
  'date_of_birth',
];

const Admin = (props: any) => {
  const router = useRouter();
  const { status: sessionStatus, data: user_session } = useSession();

  console.log(user_session);
  const {
    data: students,
    isSuccess,
    status,
    isFetching,
    refetch,
  } = useQuery('getSchools', () => getSchools(user_session?.access_token), {
    enabled: false,
  });

  console.log({ students });

  const { mutate, isLoading, error } = useMutation(
    (data: boolean) => {
      return updateAdmission(
        selectedRecords[0].id,
        data,
        user_session?.access_token
      );
    },
    {
      onSuccess: async (data) => {
        if (!data.error) {
          showAlert('success', 'Admission updated Successfully');
          refetch();
        } else {
          showAlert('error', 'An error occured');
        }
      },
      onError: (error: any) => {
        showAlert('error', 'An Error Occured');
      },
    }
  );

  useEffect(() => {
    let path = router.asPath.split('#');
    if (path[1] == 'create-admission') {
      setmodal(true);
    } else if (path[1] == 'create-bulk-upload') {
      setuploadModal(true);
    }
  }, [router]);

  useEffect(() => {
    if (sessionStatus == 'authenticated') {
      refetch();
    }
  }, [sessionStatus, refetch]);

  const dispatch = useDispatch();
  const [selectedRecords, setSelectedRecords] = useState<any>([]);
  const [modal, setmodal] = useState(false);
  const [uploadModal, setuploadModal] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle('Schoolwave | Super Admin Dashboard'));
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(students, 'id'));
  const [recordsData, setRecordsData] = useState(initialRecords);

  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'id',
    direction: 'asc',
  });

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);

  console.log({ students });

  return (
    <div>
      <div className='panel'>
        <div className='mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center'>
          <h5 className=' text-3xl font-semibold dark:text-white-light'>
            Schools
          </h5>
          <div className='flex flex-wrap items-center'>
            <button
              type='button'
              className='btn btn-primary btn-sm m-1'
              onClick={() => {
                setmodal(true);
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='mr-2 h-5 w-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Create School
            </button>

            <Transition appear show={modal} as={Fragment}>
              <Dialog as='div' open={modal} onClose={() => setmodal(false)}>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='fixed inset-0' />
                </Transition.Child>
                <div
                  id='fadein_left_modal'
                  className='fixed inset-0 z-[999] overflow-y-auto bg-[black]/60'
                >
                  <div className='flex min-h-screen items-start justify-center px-4'>
                    <Dialog.Panel className='panel animate__animated animate__fadeInDown my-8 w-full max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark'>
                      <div className='mx-auto w-4/5 py-5'>
                        <CreateSchool
                          user_session={user_session}
                          setmodal={setmodal}
                          refreshAdmission={refetch}
                        />
                      </div>
                    </Dialog.Panel>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
          <input
            type='text'
            className='form-input w-auto'
            placeholder='Search...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='datatables'>
          <DataTable
            highlightOnHover
            className='table-hover whitespace-nowrap'
            records={recordsData}
            columns={[
              { accessor: 'id', title: 'School ID', sortable: true },
              {
                accessor: 'student_info.first_name',
                title: 'Name',
                sortable: true,
              },
              {
                accessor: 'student_info.last_name',
                title: 'Description',
                sortable: true,
              },
              {
                accessor: 'student_info.last_name',
                title: 'Owner',
                sortable: true,
              },
              {
                accessor: 'created_at',
                title: 'Date of establishment',
                sortable: true,
                render: ({ created_at }) => <div>{formatDate(created_at)}</div>,
              },
              {
                accessor: 'student_info.last_name',
                title: 'Motto',
                sortable: true,
              },
            ]}
            totalRecords={initialRecords ? initialRecords.length : 0}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            minHeight={200}
            paginationText={({ from, to, totalRecords }) =>
              `Showing  ${from} to ${to} of ${totalRecords} entries`
            }
            onRowClick={(x: any) => router.push('#')}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            fetching={isFetching}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;
