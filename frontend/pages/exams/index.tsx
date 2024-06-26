import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useMutation, useQuery } from 'react-query';
import { useRouter } from 'next/router';
import Subject from '@/components/CreateSubject';
import { Dialog, Transition } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import BulkAdmission from '@/components/BulkSubjects';
import { showAlert } from '@/utility-methods/alert';
import DropDownWIthChildren from '@/components/DropDownWIthChildren';
import { getExams, editExam, deleteExam } from '@/api-calls/exam';
import CreateExam from '@/components/CreateExam';
import BulkExamination from '@/components/BulkExam';
import DeleteExam from '@/components/DeleteExam';
import EditExamForm from '@/components/EditExamForm';

const col = ['code', 'name', 'class_id', 'term'];

const Export = (props: any) => {
  const router = useRouter();
  const { status: sessionStatus, data: user_session } = useSession();
  const {
    data: examDetails,
    isSuccess,
    status,
    refetch,
  } = useQuery('getExam', () => getExams(user_session?.access_token), {
    enabled: false,
  });

  const { mutate, isLoading, error } = useMutation(
    (data: any) => {
      return editExam(selectedRecords[0].id, data, user_session?.access_token);
    },
    {
      onSuccess: async (data) => {
        showAlert('success', 'Examantion updated Successfully');
        refetch();
      },
      onError: (error: any) => {
        showAlert('error', 'An Error Occured');
      },
    }
  );

  const [activeToolTip, setActiveToolTip] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState<any>({});
  const [usermodal, setusermodal] = useState(false);
  const [assignStudent, setassignStudent] = useState(false);
  const [uploadModal, setuploadModal] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const [modal, setmodal] = useState(false);

  useEffect(() => {
    let path = router.asPath.split('#');
    if (path[1] == 'create-subject') {
      setmodal(true);
    } else if (path[1] == 'create-bulk-upload') {
      setuploadModal(true);
    }
  }, [router]);
  useEffect(() => {
    if (sessionStatus == 'authenticated') {
      refetch();
    }
  }, [sessionStatus]);
  useEffect(() => {
    if (isSuccess) {
      refetch();
      setSessions(examDetails);
    }
  }, [isSuccess]);

  const dispatch = useDispatch();
  const [selectedRecords, setSelectedRecords] = useState<any>([]);

  const canEdit = () => selectedRecords.length === 1;

  useEffect(() => {
    dispatch(setPageTitle('Schoolwave | Subjects'));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(
    sortBy(examDetails, 'id')
  );
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'id',
    direction: 'asc',
  });

  useEffect(() => {
    setInitialRecords(examDetails);
  }, [examDetails, isSuccess]);

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
      if (isSuccess && examDetails.length) {
        return examDetails.filter((item: any) => {
          return (
            item.id.toString().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase())
          );
        });
      } else {
        setInitialRecords([]);
      }
    });
  }, [search, examDetails, status]);

  useEffect(() => {
    if (activeToolTip != '') {
      const selectedSession = sessions?.find(
        (session: any) => session.id === activeToolTip
      );
      setSelectedSession(selectedSession);
    }
  }, [activeToolTip]);

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);
  const header = ['Subject Code', 'Name', 'Class', 'Action'];

  interface examInterface {
    id: string;
    name: string;
    start_date: string;
    due_date: string;
    weigh: string;
    class_name: string;
    questions: string;
  }

  const exportTable = (type: any) => {
    let columns: any = col;
    let records = examDetails ? examDetails : [];
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
      records.map((item: any) => {
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
      records.map((item: any) => {
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
      records.map((item: any) => {
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
            Examinations
          </h5>
          <div className='flex flex-wrap items-center'>
            {/* <button type="button" onClick={() => setuploadModal(true)} className="btn btn-primary btn-sm m-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
              </svg>

                            Bulk Examinations
            </button> */}

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
              Create Examination
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
                        <CreateExam
                          user_session={user_session}
                          setmodal={setmodal}
                          refreshClass={refetch}
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
                        <BulkExamination
                          user_session={user_session}
                          closeModal={setuploadModal}
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
              { accessor: 'name', title: 'Name', sortable: true },
              { accessor: 'start_date', title: 'Start Date', sortable: true },
              { accessor: 'due_date', title: 'Due Date', sortable: true },
              { accessor: 'weight', title: 'Weight', sortable: true },
              {
                accessor: 'Action',
                render: ({ action, record }: any) => (
                  <DropDownWIthChildren
                    trigger={
                      <button type='button' className='relative'>
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
                            d='M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75'
                          />
                        </svg>
                      </button>
                    }
                  >
                    <div className='absolute bottom-0 left-0 z-10 mt-8 w-[130px] translate-x-[-105%] translate-y-[100%] bg-[#f7f7f5] text-left shadow-md'>
                      <p
                        className='mb-2 cursor-pointer px-3 pt-2 hover:bg-white'
                        onClick={() => {
                          seteditModal(true);
                        }}
                      >
                        Edit
                      </p>

                      <p
                        className='mb-2 cursor-pointer  px-2 hover:bg-white'
                        onClick={() => {
                          setmodal(true);
                        }}
                      >
                        Create New
                      </p>

                      <p
                        className='mb-2 cursor-pointer  px-2 hover:bg-white'
                        onClick={() => {
                          setassignStudent(false);
                          setusermodal(true);
                        }}
                      >
                        Delete{' '}
                      </p>

                      {/* <DeleteExam sessionID={selectedSession.id} user_session={user_session} refreshClasses={refetch} /> */}
                    </div>
                  </DropDownWIthChildren>
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
            onRowClick={(rowData, fieldId: any) => {
              if (fieldId == 'Action') {
                router.push(`#`);
              } else {
                setActiveToolTip(rowData.id);
                router.push(`/exams/${rowData.id}`);
              }
            }}
            selectedRecords={selectedRecords}
          />
        </div>
        <div>
          <Transition appear show={editModal} as={Fragment}>
            <Dialog
              as='div'
              open={editModal}
              onClose={() => seteditModal(false)}
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
                  <Dialog.Panel className='panel animate__animated animate__fadeInUp my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark'>
                    <div className='mx-auto w-4/5 py-5'>
                      <h5 className=' text-lg font-semibold dark:text-white-light'>
                        Edit Exam
                      </h5>
                      {/* <p className='text-primary mb-5 text-sm'>{selectedSession.name}</p> */}

                      <EditExamForm
                        create={false}
                        user_session={user_session}
                        sessionData={selectedSession}
                        exit={seteditModal}
                        refreshClasses={refetch}
                      />
                    </div>
                  </Dialog.Panel>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default Export;
