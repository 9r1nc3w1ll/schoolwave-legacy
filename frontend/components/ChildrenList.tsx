import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';

const ChildrenList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Advanced Table'));
  });

  const rowData = [
    {
      id: 1,
      firstName: 'Caroline',
      lastName: 'Jensen',
      email: 'carolinejensen@zidant.com',
      dob: '2004-05-28',
      phone: '+1 (821) 447-3782',
      isActive: true,
      age: 39,
      company: 'POLARAX',
    },
    {
      id: 2,
      firstName: 'Celeste',
      lastName: 'Grant',
      email: 'celestegrant@polarax.com',
      dob: '1989-11-19',
      phone: '+1 (838) 515-3408',
      isActive: false,
      age: 32,
      company: 'MANGLO',
    },
    
  ];

  

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
  const [recordsData, setRecordsData] = useState(initialRecords);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'id',
    direction: 'asc',
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
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
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);


  


  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };



  return (
    <div className="panel">
      <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Children</h5>
      <div className="datatables">
        {isMounted && (
          <DataTable
            noRecordsText="No results match your search query"
            highlightOnHover
            className="table-hover whitespace-nowrap"
            records={recordsData}
            columns={[
              {
                accessor: 'id',
                title: 'ID',
                sortable: true,
                render: ({ id }) => <strong className="text-info">#{id}</strong>,
              },
              {
                accessor: 'firstName',
                title: 'Ward',
                sortable: true,
                render: ({ firstName, lastName }) => (
                  <div className="flex items-center gap-2">
                    <img src={`/assets/images/profile-${getRandomNumber(1, 34)}.jpeg`} className="h-9 w-9 max-w-none rounded-full" alt="user-profile" />
                    <div className="font-semibold">{firstName + ' ' + lastName}</div>
                  </div>
                ),
              },
             
              {
                accessor: 'email',
                title: 'Email',
                sortable: true,
                render: ({ email }) => (
                  <a href={`mailto:${email}`} className="text-primary hover:underline">
                    {email}
                  </a>
                ),
              },
             
              { accessor: 'phone', title: 'Phone', sortable: true },
              
              
            ]}
            totalRecords={initialRecords.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            minHeight={200}
            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
          />
        )}
      </div>
    </div>
  );
};

export default ChildrenList;
