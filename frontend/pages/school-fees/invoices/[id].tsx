import Invoice from "@/components/Invoice";

const items = [
  {
    id: 1,
    title: 'Calendar App Customization',
    quantity: 1,
    price: '120',
    amount: '120',
  },
  {
    id: 2,
    title: 'Chat App Customization',
    quantity: 1,
    price: '230',
    amount: '230',
  },
  {
    id: 3,
    title: 'Laravel Integration',
    quantity: 1,
    price: '405',
    amount: '405',
  },
  {
    id: 4,
    title: 'Backend UI Design',
    quantity: 1,
    price: '2500',
    amount: '2500',
  },
];

const columns = [
  {
    key: 'id',
    label: 'Items',
  },
  {
    key: 'title',
    label: 'Item Description',
  },
  {
    key: 'quantity',
    label: 'Quantity',
  },
  {
    key: 'price',
    label: 'Unit Price',
    class: 'ltr:text-right rtl:text-left',
  },
  {
    key: 'amount',
    label: 'Total Amount',
    class: 'ltr:text-right rtl:text-left',
  },
];

const clientDetails = [
  { title: 'Name', value: 'Jane Doe' },
  { title: 'Grade', value: 'Grade 1' },
  { title: 'Address', value: '405 Mulberry Rd. Mc Grady, NC, 28649' },
  { title: 'Email', value: 'redq@company.com' },
  { title: 'Phone', value: '08172644554' },
];

const invoiceDetails = [
  { title: 'From', value: 'Apr 1, 2023' },
  { title: 'To', value: 'June 1, 2023' },
  { title: 'Payment Method', value: 'Transfer/Card' },
  { title: 'Due Date', value: 'June 1, 2023' },
];

export default function InvoicePage(props: any) {


  return <Invoice items={items} columns={columns} clientDetails={clientDetails} invoiceDetails={invoiceDetails} />;
}