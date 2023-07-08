import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import Dropdown from '@/components/Dropdown';
import { setPageTitle } from '@/store/themeConfigSlice';
import AttendanceOption from './AttendanceOption';



const studets =  [
  {
    "first_name": "Akpos",
    "last_name": "Egobe",
    "id": "a1"
  },
  {
    "first_name": "Akpos1",
    "last_name": "Eg2obe",
    "id": "a2"
  },
  {
    "first_name": "Akpos",
    "last_name": "Egobe",

    "id": "a3"
  }
]



const AttendanceTable = (props: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Column Chooser Table'));
  });
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  // show/hide
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(props.students, 'user'));
  const [recordsData, setRecordsData] = useState(initialRecords);

  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'first_name',
    direction: 'asc',
  });

  const [hideCols, setHideCols] = useState<any>([]);

  const [cols, setCols] = useState<any>([]);


  useEffect(()=>{
    let arr: any = []
    if(props.attendance.length){

      props.attendance.forEach((att: any)=>{
        arr.push(att.date)
      })
    }else{
      arr.push(props.presentDay)
    }

    setCols(arr)
  }, [])


  const formatDate = (date: any) => {
    if (date) {
      const dt = new Date(date);
      const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
      const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
      return day + '/' + month + '/' + dt.getFullYear();
    }
    return '';
  };

  const showHideColumns = (col: any, value: any) => {
    if (hideCols.includes(col)) {
      setHideCols((col: any) => hideCols.filter((d: any) => d !== col));
    } else {
      setHideCols([...hideCols, col]);
    }
  };

  // const cols = [
  //   { accessor: 'id', title: 'ID' },
  //   { accessor: 'first_name', title: 'First Name' },
  //   { accessor: 'last_name', title: 'Last Name' },
  //   { accessor: 'email', title: 'Email' },
  //   { accessor: 'phone', title: 'Phone' },
  //   { accessor: 'company', title: 'Company' },
  //   { accessor: 'address.street', title: 'Address' },
  //   { accessor: 'age', title: 'Age' },
  //   { accessor: 'dob', title: 'Birthdate' },
  //   { accessor: 'isActive', title: 'Active' },
  // ];

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
      return props.students.filter((item: any) => {
        return (
         
          item.first_name.toLowerCase().includes(search.toLowerCase()) ||
                    item.last_name.toLowerCase().includes(search.toLowerCase()) 
                  
        );
      });
    });
  }, [search]);

  const attHelper =(students: any, x: any)=>{
    let dat = students.filter ((stu: { student_id: any; }) => stu.student_id == x.user)

    if(dat.length){
      return dat
    }else{
      return [{
        present: false,
        student_id: x.user 

      }]
    }
  }

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);

  const generateDateCols =()=>{

    let temp = [
      {
        accessor: 'first_name',
        title: 'First Name',
        sortable: true,
      },
      {
        accessor: 'last_name',
        title: 'Last Name',
        sortable: true,
      }

    ]
    if(props.attendance.length){
      props.attendance.forEach((att:any )=>{
        let base: any = {
 
          title: att.date,
          sortable: false,
          hidden: false,
          render: (x: any) => <AttendanceOption data={attHelper(att.students, x)} />,
        }

        temp.push(base)

      })
    }else if(props.students.length && props.today){
      let base: any = {
 
        title: props.presentday,
        sortable: false,
        hidden: false,
        render: (x: any) => <AttendanceOption data={[{present: false, student_id: x.user}]} />,
      }

      temp.push(base)

    }

  
    
    return temp
  }

  return (
    <div>
      <div className="panel">
        <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
          <h5 className="text-lg font-semibold dark:text-white-light">{props.current_class}</h5>
          <div className="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="dropdown">
                <Dropdown
                  placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                  btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                  button={
                    <>
                      <span className="ltr:mr-1 rtl:ml-1">Filter Days</span>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  }
                >
                  <ul className="!min-w-[140px]">
                    {cols.map((col: string, i: number) => {
                      return (
                        <li
                          key={i}
                          className="flex flex-col"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <div className="flex items-center px-4 py-1">
                            <label className="mb-0 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!hideCols.includes(col)}
                                className="form-checkbox"
                                defaultValue={col}
                                onChange={(event: any) => {
                                  setHideCols(event.target.value);
                                  showHideColumns(col, event.target.checked);
                                }}
                              />
                              <span className="ltr:ml-2 rtl:mr-2">{col}</span>
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="text-right">
              <input type="text" className="form-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="datatables">
          <DataTable
            className="table-hover whitespace-nowrap"
            records={recordsData}
            columns={ generateDateCols()}
            highlightOnHover
            totalRecords={initialRecords.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            minHeight={400}
            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
