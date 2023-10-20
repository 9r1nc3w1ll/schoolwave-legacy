import CreateFeeItem from "@/components/CreateFeeItem";
import EditFeeItem from "@/components/EditFeeItem";
import Link from "next/link";
import { showAlert } from "@/utility_methods/alert";
import { useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import { FeeItemInterface, IClientError, UserSession } from "@/types";
import { Fragment, useEffect, useState } from "react";
import { deleteFeeItem, getFeeItems } from "@/api-calls/fees";
import { useMutation, useQuery } from "react-query";

const Export = () => {
  const [search, setSearch] = useState<string>("");
  const [activeToolTip, setActiveToolTip] = useState<string>("");
  const [items, setItems] = useState<FeeItemInterface[]>([]);
  const [filteredsessions, setFilteredsessions] = useState<FeeItemInterface[]>(items);
  const [modal, setmodal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<FeeItemInterface>();
  const { data: sessionData, status: sessionStatus } = useSession();

  useEffect(() => {
    console.log("activeToolTip: ", activeToolTip);

    if (activeToolTip !== "") {
      const x = items.find((t) => {
        return t.id === activeToolTip;
      });

      if (x) {
        setSelectedSession(x);
      }
    }
  }, [activeToolTip]);

  const { data, isSuccess, status, isLoading, refetch } = useQuery("feeitems", () => getFeeItems(sessionData?.access_token as string), { enabled: false });

  const { mutate } = useMutation(deleteFeeItem, {
    onSuccess: () => {
      showAlert("success", "Fee Item Deleted Successfuly");
      refetch();
    },
    onError: (error: IClientError) => {
      showAlert("error", error.message);
    }
  });

  const onDeleteFeeItem = (id: string) => {
    mutate({ id, accessToken: sessionData?.access_token as string });
  };

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      refetch();
    }
  }, [sessionStatus]);

  useEffect(() => {
    setFilteredsessions(() => {
      return items?.filter((item) => {
        return item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [search, items, status]);

  useEffect(() => {
    if (isSuccess) {
      setItems(data.data);
    }
  }, [data, isSuccess, status]);

  type DisplaySession = () => JSX.Element | JSX.Element[];

  const displaySession: DisplaySession = () => {
    if (items?.length) {
      return filteredsessions?.map((item) => {
        return (
          <tr key={item.id}>
            <td>
              <div className="whitespace-nowrap"><Link href={`/session/${item.id}`}>{item.name} </Link></div>
            </td>
            <td>{item.description}</td>
            <td>{item.amount}</td>

            <td className="text-center ">

              <button type="button" className="relative" onClick={() => {
                setActiveToolTip(item.id);
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                { activeToolTip === item.id && selectedSession
                  ? (
                    <div className="bg-[#f7f7f5] absolute bottom-0 left-0 text-left shadow-md mt-8 translate-x-[-105%] translate-y-[70%] w-[110px] z-10">
                      <>
                        <p className="mb-2 px-3 pt-2 hover:bg-white" onClick={() => {
                          setmodal(true);
                        }

                        }>Edit</p>

                        <p className=" px-2 pb-3 hover:bg-white text-danger" onClick={() => {
                          onDeleteFeeItem(item.id);
                        }}>Delete</p>
                      </>

                    </div>)
                  : <></>}
              </button>

            </td>
          </tr>
        );
      });
    } else if (isLoading) {
      return <tr><td> Loading Data...</td></tr>;
    } else {
      return <tr><td> No Fee Item to display</td></tr>;
    }
  };

  return (
    <div className="lg:grid grid-cols-6 gap-6">
      <div className="panel col-span-2">
        <div className="panel bg-[#f5f6f7]">
          <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Create Fee Item</h5>
          <CreateFeeItem user_session={sessionData as UserSession} exit={setmodal} refreshList={refetch} user_session_status={sessionStatus} />
        </div>
      </div>
      <div className="panel col-span-4 " >
        <div className=" md:flex justify-between ">
          <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Fee Items</h5>

          <form className=" w-full sm:w-1/2 mb-5">
            <div className="relative">
              <input
                type="text"
                value={search}
                placeholder="Search Fee Items..."
                className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="button" className="btn btn-primary absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex sessions-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>

              </button>
            </div>
          </form>

        </div>
        <div className="table-responsive mb-5  pb-[100px] " onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          const target = e.target as HTMLDivElement;

          if (target.localName !== "svg" && target.localName !== "path") {
            setActiveToolTip("");
          }
        }}>
          <table className="table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displaySession()}
            </tbody>
          </table>
        </div>

        <div>

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
                  <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__fadeInUp">
                    <div className="w-4/5 mx-auto py-5">
                      <h5 className=" text-lg font-semibold dark:text-white-light">Edit Fee Item</h5>
                      <p className="text-primary mb-5 text-sm">{selectedSession ? selectedSession.name : ""}</p>

                      <EditFeeItem user_session_status={sessionStatus} create={false} user_session={sessionData as UserSession} sessionData={selectedSession as FeeItemInterface} exit={setmodal} refreshSession={refetch} />
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
