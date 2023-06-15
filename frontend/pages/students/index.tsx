import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useQuery } from 'react-query';
import { getStudents } from '@/apicalls/users';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';
import EditUser from '@/components/EditUser';
import { useSession } from 'next-auth/react';




const col = ['id', 'firstName', 'lastName', 'company', 'age', 'dob', 'email', 'phone', 'date_of_birth'];

const Export = (props: any) => {
  const router = useRouter()
  const dispatch = useDispatch();
  const { status: sessionStatus, data: session } = useSession();

  const [selectedRecords, setSelectedRecords] = useState<any>([]);
  const [modal, setModal] = useState(false);

  const canEdit = () => {
    return selectedRecords.length === 1
  }

  const { data: students, isSuccess, status, isLoading } = useQuery('session', () => {

    return getStudents(props.user_session.access_token)
  })

  useEffect(() => {
    dispatch(setPageTitle('Schoolwave | Students'));
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
      if(isSuccess && students.length ){

        return students.filter((item: any) => {
          return (
            item.id.toString().includes(search.toLowerCase()) ||
            item.first_name.toLowerCase().includes(search.toLowerCase()) ||
            item.last_name.toLowerCase().includes(search.toLowerCase())

          );
        });
      } else {
        setInitialRecords([])
      }
    });
  }, [search, students, status]);

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);
  const header = ['Id', 'Firstname', 'Lastname', 'Email', 'Start Date', 'Phone No.', 'Age', 'Company'];

  const formatDate = (date: any) => {
    if (date) {
      const dt = new Date(date);
      const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
      const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
      return day + '/' + month + '/' + dt.getFullYear();
    }
    return '';
  };

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
        var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
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
      var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
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
        var data1 = 'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
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
      <div className="panel">
        <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <h5 className=" text-3xl font-semibold dark:text-white-light">Students</h5>
          <div className="flex flex-wrap items-center">
            <button type="button" onClick={() => exportTable('csv')} className="btn btn-primary btn-sm m-1 ">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                <path
                  d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                  fill="currentColor"
                />
                <path opacity="0.5" d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              CSV
            </button>



            <button type="button" onClick={() => exportTable('print')} className="btn btn-primary btn-sm m-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                <path
                  d="M6 17.9827C4.44655 17.9359 3.51998 17.7626 2.87868 17.1213C2 16.2426 2 14.8284 2 12C2 9.17157 2 7.75736 2.87868 6.87868C3.75736 6 5.17157 6 8 6H16C18.8284 6 20.2426 6 21.1213 6.87868C22 7.75736 22 9.17157 22 12C22 14.8284 22 16.2426 21.1213 17.1213C20.48 17.7626 19.5535 17.9359 18 17.9827"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path opacity="0.5" d="M9 10H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M19 14L5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path
                  d="M18 14V16C18 18.8284 18 20.2426 17.1213 21.1213C16.2426 22 14.8284 22 12 22C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  opacity="0.5"
                  d="M17.9827 6C17.9359 4.44655 17.7626 3.51998 17.1213 2.87868C16.2427 2 14.8284 2 12 2C9.17158 2 7.75737 2 6.87869 2.87868C6.23739 3.51998 6.06414 4.44655 6.01733 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle opacity="0.5" cx="17" cy="10" r="1" fill="currentColor" />
                <path opacity="0.5" d="M15 16.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path opacity="0.5" d="M13 19H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              PRINT
            </button>


            <p className={`btn ${canEdit() ? 'btn-primary btn-sm ' : 'bg-[#f2f5f7] shadow-sm text-sm'} m-1`} onClick={() => {
              if (canEdit()) {

                setModal(true)
              }
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>

              EDIT
            </p>

          </div>

          <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Transition appear show={modal} as={Fragment}>
          <Dialog as="div" open={modal} onClose={() => setModal(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0" />
            </Transition.Child>
            <div id="slideIn_down_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
              <div className="flex items-start justify-center min-h-screen px-4">
                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInDown">
                  <EditUser type='student' data={selectedRecords[0]} />
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </Transition>
        <div className="datatables">
          <DataTable
            highlightOnHover
            className="table-hover whitespace-nowrap"
            records={recordsData}
            columns={[
              { accessor: 'id', title: 'Admission No.', sortable: true },
              { accessor: 'first_name', title: 'First Name', sortable: true },
              { accessor: 'last_name', title: 'Last Name', sortable: true },
              { accessor: 'class', title: 'Class', sortable: true },
              { accessor: 'guardian_name', title: 'Guardian Name', sortable: true },
              {
                accessor: 'date_of_birth',
                title: 'D.O.B',
                sortable: true,
                render: ({ date_of_birth }) => <div>{formatDate(date_of_birth)}</div>,
              },

              { accessor: 'guardian_phone_number', title: 'Phone', sortable: true },
            ]}
            totalRecords={initialRecords? initialRecords.length : 0}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            minHeight={200}
            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}

            onRowClick={(x: any) =>
              router.push('/students/' + x.id)
            }

            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
          />
        </div>
      </div>
    </div>
  );
};

export default Export;
