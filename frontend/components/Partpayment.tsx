import { useForm } from "react-hook-form";
import { UsePayWithFlutterWaveParams, usePayWithFlutterWave } from "@/hooks/usePayWithFlutterWave";
import { useMemo, useState } from "react";

interface PartPaymemtFormValues {
  amount: number;
  email: string;
  name: string;
  phone_number: string;
}

const PartPayment = () => {
  const { register, handleSubmit, getValues, reset } = useForm<PartPaymemtFormValues>({ shouldUseNativeValidation: true });
  const [config, setConfig] = useState<UsePayWithFlutterWaveParams>();

  const options: UsePayWithFlutterWaveParams = {
    amount: getValues().amount,
    onClose: () => setConfig(undefined),
    customer: {
      name: getValues().name,
      email: getValues().email,
      phone_number: getValues().phone_number,
    },
    customizations: {
      title: "Pay for invoice",
      description: "Pay for the invoice"
    }
  };
  const { handlePayment } = usePayWithFlutterWave(config as UsePayWithFlutterWaveParams);

  const onSubmit = handleSubmit((data) => {
    options.amount = data.amount;
    options.customer.name = data.name;
    options.customer.email = data.email;
    options.customer.phone_number = data.phone_number;
    reset();
    setConfig(options);
  });

  useMemo(() => {
    if (config) handlePayment();
  }, [config]);

  return (
    <div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <h1>Part Payment</h1>
        <div>
          <label htmlFor="amount">Amount</label>
          <input id="amount" type="number" className="form-input" {...register("amount", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" className="form-input" {...register("email", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="text" className="form-input" {...register("phone_number", { required: "This field is required" })} />
        </div>
        <div className="flex justify-center items-center mt-8 mx-auto">
          <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
            Pay Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartPayment;
