import { InvoiceTypes } from "@/types";
import PartPayment from "@/components/Partpayment";
import { getInvoiceById } from "@/apicalls/fees";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

export default function Checkout () {
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceTypes | null>(null);
  const { id } = router.query;
  const { data: userSession } = useSession();
  const { data } = useQuery(["invoices", id], async () => getInvoiceById(userSession?.access_token as string, id as string), { enabled: router.isReady && id !== undefined && id !== null });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setInvoice(data.data);
    }
  }, [data]);

  return (
    <div>
      <h1>Checkout</h1>
      <div className="flex items-center">
        <button
          type="button"
          className="btn btn-primary btn-sm m-1"

        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
            Pay NGN{invoice?.outstanding_balance}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm m-1"
          onClick={() => setShowModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Part Payment
        </button>
      </div>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" open={showModal} onClose={() => setShowModal(false)}>
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
              <Dialog.Panel className="panel animate__animated animate__fadeInDown my-8 w-full max-w-3xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="mx-auto w-4/5 py-5">
                  <PartPayment />
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
