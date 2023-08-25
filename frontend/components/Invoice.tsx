import { useEffect,useRef,FC } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { setPageTitle } from '../store/themeConfigSlice';
import ReactToPrint from 'react-to-print'

interface InvoiceProps{
  items: itemsProp[];
  columns: columnsProp[];
  clientDetails: clientProp[];
  invoiceDetails: invoiceProp[]
}

interface itemsProp{
  id: number;
  title: string;
  quantity: number;
  price: string;
  amount: string
}

interface columnsProp{
  key: string;
  label: string;
  class?:string
}

interface clientProp{
  title: string;
  value: string
}

interface invoiceProp{
  title: string;
  value: string
}

const Invoice:FC<InvoiceProps> = ({items,columns,clientDetails,invoiceDetails}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Invoice Preview'));
  });

  const componentRef = useRef<any>()

  return (
    <div className='container max-w-5xl mx-auto'>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-4 lg:justify-end">
        <ReactToPrint trigger={()=>(
          <button type="button" className="btn btn-primary gap-2" >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    Print
          </button>)}
        content={()=>componentRef.current}
        />
      </div>

      <div ref={componentRef} className="panel">
        <div className="flex flex-wrap justify-between gap-4 px-4">
          <h3 className="text-2xl font-semibold uppercase text-primary">Invoice</h3>
          <div className="shrink-0">
            <Image src="/assets/images/logo.svg" alt="img" className="w-14 ltr:ml-auto rtl:mr-auto" width={100} height={100} />
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 px-4">
          <div className="mt-6 space-y-1 text-white-dark">
            <div>
              <strong>Invoice Date: </strong> July 1, 2023
            </div>
            <div>
              <strong>Invoice No.: </strong> 22-373
            </div>
          </div>
          <div className="px-4 ltr:text-right rtl:text-left ">
            <div className="mt-6 space-y-1 text-white-dark">
              <div>Innovar Academy</div>
              <div>13 Tetrick Road, Cypress Gardens, Florida, 33884, US</div>
              <div>vristo@gmail.com</div>
              <div>+1 (070) 123-4567</div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
        <div className="flex flex-col flex-wrap gap-6 md:flex-row">
          <div className="min-w-[60%] px-1">
            <div className="space-y-1 text-white-dark">
              <h5 className="mb-4 text-base font-bold text-primary">Client Details</h5>
              {clientDetails.map((detail) => (
                <div key={detail.value} className="font-semibold  dark:text-white">
                  <strong>{detail.title}: </strong>
                  {detail.value}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h5 className="mb-4 text-base font-bold text-primary">Invoice Details</h5>
            {invoiceDetails.map((detail) => (
              <div key={detail.value} className="font-semibold  text-white-dark dark:text-white">
                <strong>{detail.title}: </strong>
                {detail.value}
              </div>
            ))}
          </div>
        </div>
        <div className="table-responsive mt-6">
          <table className="table-striped">
            <thead>
              <tr>
                {columns.map((column) => {
                  return (
                    <th key={column.key} className={column?.class}>
                      {column.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td className="ltr:text-right rtl:text-left">${item.price}</td>
                    <td className="ltr:text-right rtl:text-left">${item.amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid grid-cols-1 px-4 sm:grid-cols-2">
          <div></div>
          <div className="space-y-2 ltr:text-right rtl:text-left">
            <div className="flex items-center">
              <div className="flex-1">Subtotal</div>
              <div className="w-[37%]">$3255</div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">Tax</div>
              <div className="w-[37%]">$700</div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">Shipping Rate</div>
              <div className="w-[37%]">$0</div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">Discount</div>
              <div className="w-[37%]">$10</div>
            </div>
            <div className="flex items-center text-lg font-semibold">
              <div className="flex-1">Grand Total</div>
              <div className="w-[37%]">$3945</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;