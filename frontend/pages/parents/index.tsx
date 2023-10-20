import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { downloadExcel } from 'react-export-table-to-excel';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useQuery } from 'react-query';
import { getParents } from '@/api-calls/users';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CreateParent from '@/components/CreateParent';
import { Dialog, Transition } from '@headlessui/react';
import EditParent from '@/components/EditParent';
import { useSession } from 'next-auth/react';




const col = ['id', 'firstName', 'lastName', 'company', 'age', 'dob', 'email', 'phone', 'date_of_birth' ];

const Export = (props:any) => {
  const router = useRouter()
  const { status: sessionStatus, data: user_session } = useSession();
  const {data:students, isSuccess, status, refetch} = useQuery('getParents', ()=> getParents(user_session?.access_token), {enabled: false})
    
  useEffect(() => {
    let path = router.asPath.split('#')
    if(path[1] == 'create_new'){
      setmodal(true)
    }
  }, [router]);

  useEffect(() => {
    if(sessionStatus == 'authenticated'){
      refetch()
    }

  }, [sessionStatus, refetch]);

  const dispatch = useDispatch();
  const [selectedRecords, setSelectedRecords] = useState<any>([]);
  const [modal, setmodal] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const canEdit = () => selectedRecords.length === 1


  useEffect(() => {
    dispatch(setPageTitle('Schoolwave | Parents'));
   
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
      }else{
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

  const exportTable = (type: any) => {
    let columns: any = col;
    let records = students? students: [];
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

          <h5 className=" text-3xl font-semibold dark:text-white-light">Parents</h5>
          <div className="flex flex-wrap items-center">
            {/* <button type="button" onClick={() => exportTable('csv')} className="btn btn-primary btn-sm m-1 ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
              </svg>

                           Export
            </button>
      
            <button type="button" onClick={() => exportTable('print')} className="btn btn-primary btn-sm m-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
              </svg>

                            Import
            </button> */}
     
            <button type="button"  className="btn btn-primary btn-sm m-1" onClick={()=>{
              setmodal(true)
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>


                            Create Parent
            </button>
  
            <Transition appear show={modal} as={Fragment}>
              <Dialog as="div" open={modal} onClose={() => setmodal(false)}>
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
                <div id="fadein_left_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                  <div className="flex items-start justify-center min-h-screen px-4">
                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark animate__animated animate__fadeInDown">
                      <div className="w-4/5 mx-auto py-5">
                                         
                        <CreateParent access_token={user_session?.access_token} setmodal={setmodal}  refreshParents={refetch} />
                      </div>
                    </Dialog.Panel>
                  </div>
                </div>
              </Dialog>
            </Transition>

           
            <button className={`btn ${canEdit() ?'btn-primary btn-sm ': 'bg-[#f2f5f7] shadow-sm text-sm'} m-1`} onClick={()=>{
              seteditModal(true)
            }} >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>

                            EDIT
            </button>
     
            <Transition appear show={editModal} as={Fragment}>
              <Dialog as="div" open={editModal} onClose={() => seteditModal(false)}>
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
                <div id="fadein_left_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                  <div className="flex items-start justify-center min-h-screen px-4">
                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark animate__animated animate__fadeInDown">
                      <div className="w-4/5 mx-auto py-5">
                                         
                        <EditParent access_token={user_session?.access_token} id={selectedRecords[0]?.id} seteditModal={seteditModal} refreshParents={refetch} />
                      </div>
                    </Dialog.Panel>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>

          <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
   
        <div className="datatables">
          <DataTable
            highlightOnHover
            className="table-hover whitespace-nowrap"
            records={recordsData}
            columns={[
              { accessor: 'id', title: 'Staff No.', sortable: true },
              { accessor: 'first_name', title: 'First Name', sortable: true },
              { accessor: 'last_name', title: 'Last Name', sortable: true },
              { accessor: 'role', title: 'Role', sortable: true },
                         
              { accessor: 'phone_number', title: 'Phone', sortable: true },
              { accessor: 'email', title: 'Email', sortable: true },
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

            onRowClick={(x:any) =>
              router.push('/parents/'+x.id)
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
