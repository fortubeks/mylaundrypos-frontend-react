import { useState } from "react";
import cancel from "../../../assets/icons/close.svg";
import { Button } from "../../../utils/Button";
import { Input } from "../../../utils/Input";
import toast from "../../../utils/Toast";
import { cleanUpErr, RequestService } from "../../../services";

export default function AddPayment({ setShowModal, fetch, order }) {
  const [amount, setAmount] = useState(0);
  const [mode, setMode] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await RequestService.post(`/orders/payments`, {
        order_id: order.id,
        mode_of_payment: mode,
        amount: amount,
        notes: details,
      });
      console.log(response);
      fetch();
      toast.success(`Payment added successfully`);
      setShowModal(false);
    } catch (error) {
      console.log(error);
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-full grow rounded-lg flex flex-col bg-white shadow overflow-y-auto">
      <div className="flex flex-col gap-1 py-2 px-3 sticky top-0 z-10 bg-white border-b">
        <h4 className="flex items-center relative font-extrabold text-xl gap-2 border-b pb-1">
          Add Payment
          <img
            src={cancel}
            alt=""
            className="absolute right-1 cursor-pointer"
            onClick={() => setShowModal(false)}
          />
        </h4>
        <p className="text-sm text-muted-foreground">
          Fill the form to add a new payment
        </p>
      </div>
      <form className="flex flex-col w-full gap-5 grow px-5 mt-5">
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <span>Amount</span>
            <Input type="number" selected={amount} setSelected={setAmount} />
          </div>
          <div className="space-y-2">
            <span>Mode of Payment</span>
            <Input type="text" selected={mode} setSelected={setMode} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <span>Details (optional)</span>
            <Input type="text" selected={details} setSelected={setDetails} />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 items-center justify-center mt-auto mb-4">
          <Button
            name="Add Payment"
            width="100%"
            onClick={submit}
            loading={loading}
          />
        </div>
      </form>
    </main>
  );
}
