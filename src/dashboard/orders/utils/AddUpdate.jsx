import { useEffect, useState } from "react";
import cancel from "../../../assets/icons/close.svg";
import { Button } from "../../../utils/Button";
import { Input } from "../../../utils/Input";
import toast from "../../../utils/Toast";
import { SelectDropDownImage } from "../../../utils/SelectDropdownImage";
import { cleanUpErr, RequestService } from "../../../services";

export default function AddUpdate({ setShowCreate, item, fetch }) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);

  const [form, setForm] = useState({
    name: item?.name || "",
    customer: item?.customer || "",
    total_amount: item?.total_amount || "",
    order_date: item?.order_date || new Date().toISOString().split("T")[0],
    due_date: item?.due_date || new Date().toISOString().split("T")[0],
    status: item?.status
      ? { name: item.status.charAt(0).toUpperCase() + item.status.slice(1) }
      : null,
    items:
      item?.items.map((i) => ({
        id: i.id || "",
        service_item: i.serviceItem || "",
        quantity: i.quantity || "",
        weight: i.weight || "",
        price: i.price || "",
        subtotal: i.subtotal || "",
      })) || [],
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...form.items];
    updated[index][field] = value;

    if (field === "quantity" || field === "price") {
      const qty = updated[index].quantity || 0;
      const price = updated[index].price || 0;
      updated[index].subtotal = qty * price;
    }

    setForm({ ...form, items: updated });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          service_item_id: "",
          quantity: "",
          weight: "",
          price: "",
          subtotal: "",
        },
      ],
    });
  };

  const removeItem = (index) => {
    const updated = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updated });
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await RequestService.get("/customers");
        const responseItems = await RequestService.get("/service-items");
        setCustomers(response.data.data.data);
        setServiceItems(responseItems.data.data.data);
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
      name: form.name,
      customer_id: form.customer?.id,
      total_amount: form.total_amount,
      order_date: form.order_date,
      due_date: form.due_date,
      status: form.status?.name.toLowerCase(),
      items: form.items.map((i) => ({
        id: i.id,
        service_item_id: i.service_item?.id,
        quantity: i.quantity,
        weight: i.weight,
        price: i.price,
        subtotal: i.subtotal,
      })),
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
            selected={form.name}
            setSelected={(value) => handleChange("name", value)}
          />
          <SelectDropDownImage
            items={customers.map((c) => ({
              ...c,
              name: c.first_name + " " + c.last_name,
            }))}
            selected={form.customer}
            setSelected={(value) => handleChange("customer", value)}
            placeholder="Customer"
          />
          <Input
            placeholder="Order Date"
            type="date"
            selected={form.order_date}
            setSelected={(value) => handleChange("order_date", value)}
          />
          <Input
            placeholder="Due Date"
            type="date"
            selected={form.due_date}
            setSelected={(value) => handleChange("due_date", value)}
          />
          <SelectDropDownImage
            items={[
              { name: "Pending" },
              { name: "Processing" },
              { name: "Ready" },
              { name: "Delivered" },
            ]}
            selected={form.status}
            setSelected={(value) => handleChange("status", value)}
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
