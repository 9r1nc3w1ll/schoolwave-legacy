import CreateInvoice from "@/components/CreateInvoice";
import EditInvoice from "@/components/EditInvoice";
import { getInvoices } from "@/api-calls/fees";
import { setPageTitle } from "@/store/themeConfigSlice";
import { showAlert } from "@/utility_methods/alert";
import sortBy from "lodash/sortBy";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ActionIcon, Avatar } from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, SyntheticEvent, useEffect, useState } from "react";
import { InvoiceTypes, UserSession } from "@/types";

const col = ["id", "firstName", "lastName", "company", "age", "dob", "email", "phone", "date_of_birth"];

const Export = () => {
  const router = useRouter();
  const { status: sessionStatus, data: userSession } = useSession();
  const userSessionValue = userSession as UserSession;

  const {
    data: invoices,
    refetch,
  } = useQuery(
    "getInvoices",
    async () => {
      return getInvoices(userSession?.access_token as string);
    },
    { enabled: false }
  );

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
  const [selectedRecords, setSelectedRecords] = useState<InvoiceTypes[]>([]);
  const [modal, setmodal] = useState(false);
  const [editModal, seteditModal] = useState(false);
  const canEdit = () => selectedRecords.length === 1;

  useEffect(() => {
    dispatch(setPageTitle("Schoolwave | Students"));
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(invoices?.data, "id"));
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [search, setSearch] = useState("");

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "asc",
  });

  function getFirstLetters (str: string) {
    const words = str.split(" ");
    const firstLetters = words.map((word) => word.charAt(0));

    return firstLetters.join("");
  }

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  useEffect(() => {
    if (invoices?.data?.length) {
      setInitialRecords(invoices.data);
    }
  }, [search, invoices]);

  const filteredRecords = () => {
    return recordsData.filter(
      (item) =>
        item.id.toString().includes(search.toLowerCase()) ||
                item.student_info.first_name?.toLowerCase().includes(search.toLowerCase()) ||
                item.student_info.last_name?.toLowerCase().includes(search.toLowerCase())
    );
  };

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);

    setInitialRecords(sortStatus.direction === "desc" ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);

  const exportTable = (type: string) => {
    const columns = col;
    const records = invoices?.data || [];
    const filename = "table";

    if (type === "csv") {
      const coldelimiter = ";";
      const linedelimiter = "\n";
      let result = columns
        .map((d: string) => {
          return capitalize(d);
        })
        .join(coldelimiter);

      result += linedelimiter;

      records.forEach((item) => {
        columns.forEach((d, index) => {
          if (index > 0) {
            result += coldelimiter;
          }

          if (d in item) {
            const val = item[d as keyof InvoiceTypes] ? item[d as keyof InvoiceTypes] : "";

            result += val;
          }
        });
        result += linedelimiter;
      });

      if (result == null) return;

      if (!result.match(/^data:text\/csv/i)) {
        const data = "data:application/csv;charset=utf-8," + encodeURIComponent(result);
        const link = document.createElement("a");

        link.setAttribute("href", data);
        link.setAttribute("download", filename + ".csv");
        link.click();
      }
    } else if (type === "print") {
      let rowhtml = "<p>" + filename + "</p>";

      rowhtml +=
                "<table style=\"width: 100%; \" cellpadding=\"0\" cellcpacing=\"0\"><thead><tr style=\"color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; \"> ";

      columns.forEach((d: string) => {
        rowhtml += "<th>" + capitalize(d) + "</th>";
      });
      rowhtml += "</tr></thead>";
      rowhtml += "<tbody>";

      records.forEach((item) => {
        rowhtml += "<tr>";

        columns.forEach((d) => {
          if (d in item) {
            const val = item[d as keyof InvoiceTypes] ? item[d as keyof InvoiceTypes] : "";

            rowhtml += "<td>" + val + "</td>";
          }
        });
        rowhtml += "</tr>";
      });

      rowhtml +=
                "<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>";
      rowhtml += "</tbody></table>";
      const winPrint = window.open("", "", "left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0");

      winPrint?.document.write("<title>Print</title>" + rowhtml);
      winPrint?.document.close();
      winPrint?.focus();
      winPrint?.print();
    } else if (type === "txt") {
      const coldelimiter = ",";
      const linedelimiter = "\n";
      let result = columns
        .map((d) => {
          return capitalize(d);
        })
        .join(coldelimiter);

      result += linedelimiter;

      records.forEach((item) => {
        columns.forEach((d, index) => {
          if (index > 0) {
            result += coldelimiter;
          }

          if (d in item) {
            const val = item[d as keyof InvoiceTypes] ? item[d as keyof InvoiceTypes] : "";

            result += val;
          }
        });
        result += linedelimiter;
      });

      if (result == null) return;

      if (!result.match(/^data:text\/txt/i)) {
        const data1 = "data:application/txt;charset=utf-8," + encodeURIComponent(result);
        const link1 = document.createElement("a");

        link1.setAttribute("href", data1);
        link1.setAttribute("download", filename + ".txt");
        link1.click();
      }
    }
  };

  const capitalize = (text: string) => {
    return text
      .replace("_", " ")
      .replace("-", " ")
      .toLowerCase()
      .split(" ")
      .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  };

  const copyInvoiceUrl = (id: string) => {
    navigator.clipboard.writeText(`localhost:3000/checkout/${id}`);
    showAlert("success", "Payment link copied to cliopboard");
  };

  return (
    <div>
      <div className="panel">
        <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <h5 className=" text-3xl font-semibold dark:text-white-light">Invoices</h5>
          <div className="flex flex-wrap items-center">
            <button type="button" onClick={() => exportTable("csv")} className="btn btn-primary btn-sm m-1 ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-5 w-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                />
              </svg>
                            Export
            </button>

            <button type="button" onClick={() => exportTable("print")} className="btn btn-primary btn-sm m-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-5 w-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
                />
              </svg>
                            Import
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm m-1"
              onClick={() => {
                setmodal(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
                            Generate Invoice
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
                <div id="fadein_left_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60" data-cy="createEmployeeModal">
                  <div className="flex min-h-screen items-start justify-center px-4">
                    <Dialog.Panel className="panel animate__animated animate__fadeInDown my-8 w-full max-w-xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                      <div className="mx-auto w-4/5 py-5">
                        <CreateInvoice user_session_status={sessionStatus} user_session={userSession as UserSession} setmodal={setmodal} refreshEmployee={refetch} />
                      </div>
                    </Dialog.Panel>
                  </div>
                </div>
              </Dialog>
            </Transition>

            <button
              className={`btn ${canEdit() ? "btn-primary btn-sm " : "bg-[#f2f5f7] text-sm shadow-sm"} m-1`}
              onClick={() => {
                seteditModal(true);
              }}
              disabled={!canEdit()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
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
                <div id="fadein_left_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                  <div className="flex min-h-screen items-start justify-center px-4">
                    <Dialog.Panel className="panel animate__animated animate__fadeInDown my-8 w-full max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                      <div className="mx-auto w-4/5 py-5">
                        <EditInvoice
                          school={userSessionValue?.school?.id}
                          access_token={userSession?.access_token as string}
                          invoice={selectedRecords[0]}
                          seteditModal={seteditModal}
                          refreshInvoice={refetch}
                        />
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
              {
                accessor: "student name",
                title: "Student Name",
                render: (cell) => {
                  const { student_info: studentInfo } = cell;

                  return (
                    <div className="flex items-center gap-3">
                      <Avatar color="cyan" radius="xl">
                        {getFirstLetters(`${studentInfo.first_name} ${studentInfo.last_name}`)}
                      </Avatar>
                      <span>
                        {studentInfo.first_name} {studentInfo.last_name}
                      </span>
                    </div>
                  );
                },
              },
              { accessor: "id", title: "Invoice No.", sortable: true },
              { accessor: "outstanding_balance", title: "Outstanding Balance", sortable: true },
              { accessor: "amount_paid", title: "Amount Paid", sortable: true },
              { accessor: "balance", title: "Balance", sortable: true },
              {
                accessor: "actions",
                title: "Actions",
                render: (cell) => (
                  <div className="relative">
                    <ActionIcon onClick={(e: SyntheticEvent) => {
                      e.stopPropagation();
                      // copyInvoiceUrl(cell.id);
                      router.push(`/checkout/${cell.id}`)
                    }} color="black">
                      <span className="text-xs text-black font-medium underline">Make payment</span>
                    </ActionIcon>
                  </div>
                )
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
            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
            onRowClick={(x) => router.push("/employees/" + x.id)}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
          />
        </div>
      </div>
    </div>
  );
};

export default Export;
