import BulkEmployee from "@/components/BulkEmployee";
import CreateEmployee from "@/components/CreateEmployee";
import CreateStaffRole from "@/components/CreateStaffRole";
import EditEmployee from "@/components/EditEmployee";
import { UserSession } from "@/types";
import { getAllStaff } from "@/api-calls/staffs";
import { setPageTitle } from "@/store/themeConfigSlice";
import sortBy from "lodash/sortBy";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

const Export = () => {
  const router = useRouter();
  const { status: sessionStatus, data: userSession } = useSession();
  const [uploadModal, setuploadModal] = useState(false);

  const { data: students, isSuccess, status, refetch } = useQuery("getStaffs", async () => {
    return getAllStaff(userSession?.access_token);
  }, { enabled: false });

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      refetch();
    }
  }, [sessionStatus, refetch]);

  useEffect(() => {
    const path = router.asPath.split("#");

    if (path[1] === "create_new") {
      setmodal(true);
    }
  }, [router]);

  const dispatch = useDispatch();
  const [selectedRecords, setSelectedRecords] = useState<any>([]);
  const [modal, setmodal] = useState(false);
  const [isCreateEmployeeRoleOpen, setIsCreateEmployeeRoleOpen] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const canEdit = () => selectedRecords.length === 1;

  useEffect(() => {
    dispatch(setPageTitle("Schoolwave | Students"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(students, "id"));
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [search, setSearch] = useState("");

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "asc",
  });

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  const filteredRecords = () => {
    return recordsData.filter(
      (item) =>
        item.id.toString().includes(search.toLowerCase()) ||
                item.user_info.first_name?.toLowerCase().includes(search.toLowerCase()) ||
                item.user_info.last_name?.toLowerCase().includes(search.toLowerCase())
    );
  };
  
  useEffect(() => {
    if (isSuccess) {
      setInitialRecords(students);
    }
  }, [search, students, status]);

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);

    setInitialRecords(sortStatus.direction === "desc" ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);

  return (
    <div>
      <div className="panel">
        <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <h5 className=" text-3xl font-semibold dark:text-white-light">Employees</h5>
          <div className="flex flex-wrap items-center">
            <button onClick={() => setuploadModal(true)} type="button" className="btn btn-primary btn-sm m-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
              </svg>

                            Bulk Upload
            </button>

            <Transition appear show={uploadModal} as={Fragment}>
              <Dialog as="div" open={uploadModal} onClose={() => setuploadModal(false)}>
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
                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-xl my-8 text-black dark:text-white-dark animate__animated animate__fadeInDown">
                      <div className="w-4/5 mx-auto py-5">

                        <BulkEmployee userSession={userSession as UserSession} closeModal={setuploadModal} refreshAdmission={refetch} />
                      </div>
                    </Dialog.Panel>
                  </div>
                </div>
              </Dialog>
            </Transition>

            <button type="button" className="btn btn-primary btn-sm m-1" onClick={() => {
              setmodal(true);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

                            Create Employee
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
                <div id="fadein_left_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto" data-cy="createEmployeeModal" >
                  <div className="flex items-start justify-center min-h-screen px-4">
                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark animate__animated animate__fadeInDown">
                      <div className="w-4/5 mx-auto py-5">

                        <CreateEmployee userSession={userSession as UserSession} user_session_status={sessionStatus} setmodal={setmodal} refreshEmployee={refetch} />
                      </div>
                    </Dialog.Panel>
                  </div>
                </div>
              </Dialog>
            </Transition>
            <button type="button" className="btn btn-primary btn-sm m-1" onClick={() => {
              setIsCreateEmployeeRoleOpen(true);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

                            Create Employee Role
            </button>

            <Transition appear show={isCreateEmployeeRoleOpen} as={Fragment}>
              <Dialog as="div" open={isCreateEmployeeRoleOpen} onClose={() => setIsCreateEmployeeRoleOpen(false)}>
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
                <div id="fadein_left_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto" data-cy="createEmployeeModal" >
                  <div className="flex items-start justify-center min-h-screen px-4">
                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark animate__animated animate__fadeInDown">
                      <div className="w-4/5 mx-auto py-5">

                        <CreateStaffRole accessToken={userSession?.access_token as string} close={setIsCreateEmployeeRoleOpen} refreshList={refetch} />
                      </div>
                    </Dialog.Panel>
                  </div>
                </div>
              </Dialog>
            </Transition>

            <button className={`btn ${canEdit() ? "btn-primary btn-sm " : "bg-[#f2f5f7] shadow-sm text-sm"} m-1`} onClick={() => {
              seteditModal(true);
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

                        <EditEmployee access_token={userSession?.access_token} id={selectedRecords[0]?.id} seteditModal={seteditModal} refreshEmployee={refetch} />
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
            records={filteredRecords()}
            columns={[
              { accessor: "id", title: "Staff No.", sortable: true },
              { accessor: "user_info.first_name", title: "First Name", sortable: true },
              { accessor: "user_info.last_name", title: "Last Name", sortable: true },
              { accessor: "title", title: "Title", sortable: true },
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
            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}

            onRowClick={(x: any) =>
              router.push("/employees/" + x.id)
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
