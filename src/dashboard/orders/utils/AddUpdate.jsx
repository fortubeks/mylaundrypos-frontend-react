import { useEffect, useState } from "react";
import cancel from "../../../assets/icons/close.svg";
import { Button } from "../../../utils/Button";
import { Input } from "../../../utils/Input";
import toast from "../../../utils/Toast";
import { SelectDropDownImage } from "../../../utils/SelectDropdownImage";
import { cleanUpErr, RequestService } from "../../../services";

export default function AddUpdate({ setShowCreate, item, fetch }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(item?.name || "");
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState({} || null);
  const [totalAmount, setTotalAmount] = useState(
    Number(item?.total_amount) || ""
  );
  const [orderDate, setOrderDate] = useState(
    item?.order_date || new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    item?.due_date || new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState(
    item?.status
      ? { name: item.status.charAt(0).toUpperCase() + item.status.slice(1) }
      : null
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await RequestService.get("/customers");
        setCustomers(response.data.data.data);
        if (item) {
          const customerItem = response.data.data.data.find(
            (c) => c.id === item.customer_id
          );
          setCustomer({
            ...customerItem,
            name: customerItem.first_name + " " + customerItem.last_name,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: name,
      customer_id: customer?.id || null,
      total_amount: totalAmount,
      order_date: orderDate,
      due_date: dueDate,
      status: status?.name.toLowerCase() || "pending",
    };
    try {
      let response;
      if (item) {
        response = await RequestService.put(`/orders/${item.id}`, payload);
      } else {
        response = await RequestService.post("/orders", payload);
      }
      console.log(response);
      fetch();
      toast.success(`Order ${item ? "updated" : "added"} successfully`);
      setShowCreate(false);
    } catch (error) {
      console.log(error);
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-full grow flex flex-col bg-white shadow">
      <div className="flex flex-col gap-1 py-2 px-3">
        <h4 className="flex items-center relative font-extrabold text-xl gap-2 border-b pb-1">
          {item ? "Update Order" : "Add Order"}
          <img
            src={cancel}
            alt=""
            className="absolute right-1 cursor-pointer"
            onClick={() => setShowCreate(false)}
          />
        </h4>
        <p className="text-sm text-muted-foreground">
          {item
            ? "Update the details of this order"
            : "Fill the form to add a new order"}
        </p>
      </div>
      <form className="flex flex-col w-full gap-5 grow px-3 mt-5">
        <div className="flex flex-col gap-5">
          <Input
            placeholder="Order Name"
            type="text"
            selected={name}
            setSelected={setName}
          />
          <SelectDropDownImage
            items={customers.map((c) => ({
              ...c,
              name: c.first_name + " " + c.last_name,
            }))}
            selected={customer}
            setSelected={setCustomer}
            placeholder="Customer"
          />
          <Input
            placeholder="Total Amount"
            type="number"
            selected={totalAmount}
            setSelected={setTotalAmount}
          />
          <Input
            placeholder="Order Date"
            type="date"
            selected={orderDate}
            setSelected={setOrderDate}
          />
          <Input
            placeholder="Due Date"
            type="date"
            selected={dueDate}
            setSelected={setDueDate}
          />
          <SelectDropDownImage
            items={[
              { name: "Pending" },
              { name: "Processing" },
              { name: "Ready" },
              { name: "Delivered" },
            ]}
            selected={status}
            setSelected={setStatus}
            placeholder="Status"
          />
        </div>
        <div className="w-full flex flex-col gap-2 items-center justify-center mt-auto mb-4">
          <Button
            name={item ? "Update Order" : "Add Order"}
            width="100%"
            onClick={submit}
            loading={loading}
          />
        </div>
      </form>
    </main>
  );
}
