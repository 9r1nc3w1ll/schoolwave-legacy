import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { downloadExcel } from 'react-export-table-to-excel';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useMutation, useQuery } from 'react-query';
import { getParents } from '@/api-calls/users';
import { useRouter } from 'next/router';
import CreateAdmission from '@/components/CreateAdmission';
import { Dialog, Transition } from '@headlessui/react';
import EditParent from '@/components/EditParent';
import { useSession } from 'next-auth/react';
import UploadAdmission from '@/components/UploadFile';
import BulkAdmission from '@/components/BulkAdmission';
import {
  getAdmissions,
  updateAdmission,
  updateAdmissionSingle,
} from '@/api-calls/admissions';
import { formatDate } from '@/utility-methods/datey';
import { showAlert } from '@/utility-methods/alert';
import { ResponseInterface } from '@/types';
import { TAdmissionResponse } from '@/models/Admission';
import { ActionIcon, CheckIcon } from '@mantine/core';
import BulkAdmissionDropDown from '@/components/BulkAdmissionDropDown';

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
interface Record {
  id: string; // Assuming 'id' is a number
  // Other properties...
}

const Export = (props: any) => {
  const [recordIndex, setRecordIndex] = useState(0);
  const [recordRow, setRecordRow] = useState<Record | null>(null);
  const router = useRouter();
  const { status: sessionStatus, data: user_session } = useSession();
  const {
    data: students,
    isSuccess,
    status,
    refetch,
  } = useQuery(
    'getAdmission',
    () => getAdmissions(user_session?.access_token!),
    { enabled: false }
  );
  const {
    mutate: update,
    isLoading,
    error,
  } = useMutation(
    (data: any): any => {
      const recordID: string[] = selectedRecords.map((rec: Record) => rec.id);
      return updateAdmission(
        recordID,
        data,
        user_session?.access_token,
        user_session?.school?.id
      );
    },
    {
      onSuccess: async (data: string) => {
        if (!(data === 'Bulk update successful')) {
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

  const { mutate: updateSingle } = useMutation(
    (data: any): any => {
      if (recordRow) {
        const { id } = recordRow;
        return updateAdmissionSingle(
          id,
          data,
          user_session?.access_token,
          user_session?.school?.id
        );
      }
    },
    {
      onSuccess: async (data: ResponseInterface<TAdmissionResponse>) => {
        if (!(data.status === 'error')) {
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
  const canEdit = () => selectedRecords.length === 1;

  useEffect(() => {
    dispatch(setPageTitle('Schoolwave | Admissions'));
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
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  useEffect(() => {
    setInitialRecords(() => {
      if (isSuccess && (students as any).length) {
        return (students as any).filter((item: any) => {
          return (
            item.id.toString().includes(search.toLowerCase()) ||
            item.student_info.first_name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            item.student_info.last_name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            item.status.toLowerCase().includes(search.toLowerCase())
          );
        });
      } else {
        setInitialRecords([]);
      }
    });
  }, [search, students, status]);

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);
  const header = [
    'Id',
    'Firstname',
    'Lastname',
    'Email',
    'Start Date',
    'Phone No.',
    'Age',
    'Company',
  ];

  const exportTable = (type: any) => {
    let columns: any = col;
    let records = students ? students : [];
    let filename = 'table';

    let newVariable: any;
    newVariable = window.navigator;

    if (type === 'csv') {
      let coldelimiter = ';';
      let linedelimiter = '\n';
      let result = columns
        .map((d: any) => {
          return capitalize(d);
        })
        .join(coldelimiter);
      result += linedelimiter;
      (records as any).map((item: any) => {
        columns.map((d: any, index: any) => {
          if (index > 0) {
            result += coldelimiter;
          }
          let val = item[d] ? item[d] : '';
          result += val;
        });
        result += linedelimiter;
      });

      if (result == null) return;
      if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
        var data =
          'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
        var link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename + '.csv');
        link.click();
      } else {
        var blob = new Blob([result]);
        if (newVariable.msSaveOrOpenBlob) {
          newVariable.msSaveBlob(blob, filename + '.csv');
        }
      }
    } else if (type === 'print') {
      var rowhtml = '<p>' + filename + '</p>';
      rowhtml +=
        '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
      columns.map((d: any) => {
        rowhtml += '<th>' + capitalize(d) + '</th>';
      });
      rowhtml += '</tr></thead>';
      rowhtml += '<tbody>';
      (records as any).map((item: any) => {
        rowhtml += '<tr>';
        columns.map((d: any) => {
          let val = item[d] ? item[d] : '';
          rowhtml += '<td>' + val + '</td>';
        });
        rowhtml += '</tr>';
      });
      rowhtml +=
        '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
      rowhtml += '</tbody></table>';
      var winPrint: any = window.open(
        '',
        '',
        'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0'
      );
      winPrint.document.write('<title>Print</title>' + rowhtml);
      winPrint.document.close();
      winPrint.focus();
      winPrint.print();
    } else if (type === 'txt') {
      let coldelimiter = ',';
      let linedelimiter = '\n';
      let result = columns
        .map((d: any) => {
          return capitalize(d);
        })
        .join(coldelimiter);
      result += linedelimiter;
      (records as any).map((item: any) => {
        columns.map((d: any, index: any) => {
          if (index > 0) {
            result += coldelimiter;
          }
          let val = item[d] ? item[d] : '';
          result += val;
        });
        result += linedelimiter;
      });

      if (result == null) return;
      if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
        var data1 =
          'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
        var link1 = document.createElement('a');
        link1.setAttribute('href', data1);
        link1.setAttribute('download', filename + '.txt');
        link1.click();
      } else {
        var blob1 = new Blob([result]);
        if (newVariable.msSaveOrOpenBlob) {
          newVariable.msSaveBlob(blob1, filename + '.txt');
        }
      }
    }
  };

  const capitalize = (text: any) => {
    return text
      .replace('_', ' ')
      .replace('-', ' ')
      .toLowerCase()
      .split(' ')
      .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
  };
  return (
    <div>
      <div className='panel'>
        <div className='mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center'>
          <h5 className=' text-3xl font-semibold dark:text-white-light'>
            Admissions
          </h5>
          <div className='flex flex-wrap items-center'>
            {selectedRecords.length > 1 ? (
              <div className='flex items-center'>
                <button
                  type='button'
                  onClick={() => {
                    if (selectedRecords.length > 1) {
                      update(true);
                    }
                  }}
                  className={`btn ${
                    selectedRecords.length > 1 ? 'btn-success' : ' bg-grey'
                  } btn-sm m-1 `}
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
                      d='M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12'
                    />
                  </svg>
                  Approve
                </button>

                <button
                  type='button'
                  onClick={() => {
                    if (selectedRecords.length > 1) {
                      update(false);
                    }
                  }}
                  className={`btn ${
                    selectedRecords.length > 1 ? 'btn-danger' : ' bg-grey'
                  } btn-sm m-1 `}
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
                      d='M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'
                    />
                  </svg>
                  Decline
                </button>
              </div>
            ) : null}
            <button
              type='button'
              onClick={() => setuploadModal(true)}
              className='btn btn-primary btn-sm m-1'
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
                  d='M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15'
                />
              </svg>
              Bulk Admission
            </button>

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
              Create Admission
            </button>
            {/* <div className='m-1'>
              <BulkAdmissionDropDown size={8} />
            </div> */}

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
                        <CreateAdmission
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

            <Transition appear show={uploadModal} as={Fragment}>
              <Dialog
                as='div'
                open={uploadModal}
                onClose={() => setuploadModal(false)}
              >
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
                    <Dialog.Panel className='panel animate__animated animate__fadeInDown my-8 w-full max-w-xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark'>
                      <div className='mx-auto w-4/5 py-5'>
                        <BulkAdmission
                          user_session={user_session}
                          closeModal={setuploadModal}
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
            textSelectionDisabled
            className='table-hover whitespace-nowrap'
            records={recordsData}
            columns={[
              { accessor: 'id', title: 'Admission No.', sortable: true },
              {
                accessor: 'student_info.first_name',
                title: 'First Name',
                sortable: true,
              },
              {
                accessor: 'student_info.last_name',
                title: 'Last Name',
                sortable: true,
              },
              {
                accessor: 'status',
                render: ({ status }) => (
                  <div
                    className={
                      status == 'approved'
                        ? 'badge bg-success'
                        : status == 'denied'
                        ? 'badge bg-danger'
                        : 'badge bg-warning'
                    }
                  >
                    {status}
                  </div>
                ),
                sortable: true,
              },
              {
                accessor: 'created_at',
                title: 'Request Date',
                sortable: true,
                render: ({ created_at }) => <div>{formatDate(created_at)}</div>,
              },
              {
                accessor: 'action',
                title: '',
                render: () => (
                  <ActionIcon
                    size='sm'
                    variant='subtle'
                    color='blue'
                    id=''
                    onClick={(e: React.MouseEvent) => {
                      // e.stopPropagation();
                    }}
                  >
                    <BulkAdmissionDropDown
                      updateSingle={updateSingle}
                      size={5}
                    />
                  </ActionIcon>
                ),
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
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            onRowClick={(record, recordIndex) => {
              setRecordIndex(recordIndex);
              setRecordRow(record);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Export;
