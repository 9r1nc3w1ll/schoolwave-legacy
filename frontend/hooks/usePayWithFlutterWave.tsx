import { FlutterwaveConfig } from "flutterwave-react-v3/dist/types";
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";

type Customer = {
  email: string;
  phone_number: string;
  name: string;
};
type Customizations = {
  title: string;
  description: string;
  logo?: string;
};

export interface UsePayWithFlutterWaveParams {
  onClose?: () => void;
  customer: Customer;
  customizations?: Customizations;
  amount: number;
}

export const usePayWithFlutterWave = (payload: UsePayWithFlutterWaveParams) => {
  const config: FlutterwaveConfig = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ?? "",
    tx_ref: Date.now().toString(),
    amount: payload?.amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: payload?.customer,
    customizations: {
      title: payload?.customizations?.title as string,
      description: payload?.customizations?.description as string,
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    console.log("config: ", config);

    if (!payload) {
      return;
    }

    handleFlutterPayment({
      callback: (response) => {
        closePaymentModal(); // this will close the modal programmatically
      },
      onClose: () => {
        if (payload?.onClose) payload.onClose();
        closePaymentModal();
      },
    });
  };

  return { handlePayment };
};
