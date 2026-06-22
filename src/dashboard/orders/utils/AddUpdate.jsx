import { useEffect, useState } from "react";
import cancel from "../../../assets/icons/close.svg";
import { Button } from "../../../utils/Button";
import { Input } from "../../../utils/Input";
import toast from "../../../utils/Toast";
import { SelectDropDownImage } from "../../../utils/SelectDropdownImage";
import { cleanUpErr, RequestService } from "../../../services";
import { MultiSelectDropDown } from "../../../utils/MultiSelectDropDown";

export default function AddUpdate({ setShowCreate, item, fetch }) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);

  const [form, setForm] = useState({
    // name: item?.name || "",
    customer: item?.customer
      ? {
          ...item?.customer,
          name: item?.customer?.first_name + " " + item?.customer?.last_name,
        }
      : null,
    total_amount: item?.total_amount || "",
    order_date: item?.order_date || new Date().toISOString().split("T")[0],
    due_date: item?.due_date || new Date().toISOString().split("T")[0],
    notes: item?.notes || "",
    status: item?.status
      ? { name: item.status.charAt(0).toUpperCase() + item.status.slice(1) }
      : { name: "Pending" },
    items:
      item?.items.map((i) => ({
        id: i.id || "",
        service_item: i.service_item || "",
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
      const qty = updated[index].quantity || 1;
      const price = updated[index].price || 0;
      updated[index].subtotal = qty * price;
    } else if (field === "weight" || field === "price") {
      const weight = updated[index].weight || 1;
      const price = updated[index].price || 0;
      updated[index].subtotal = weight * price;
    }
    console.log(updated);

    setForm({ ...form, items: updated });
  };

  // calculate total amount whenever items change
  useEffect(() => {
    const total = form.items.reduce(
      (acc, curr) => acc + (Number(curr.subtotal) || 0),
      0
    );
    setForm((prev) => ({ ...prev, total_amount: total }));
  }, [form.items]);

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
      // name: form.name,
      customer_id: form.customer?.id,
      total_amount: form.total_amount,
      order_date: form.order_date,
      due_date: form.due_date,
      notes: form.notes?.trim() || undefined,
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
    <main className="w-full h-full grow flex flex-col bg-white shadow overflow-y-auto">
      <div className="flex flex-col gap-1 py-2 px-3 sticky top-0 z-10 bg-white border-b">
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
        <div className="grid grid-cols-2 gap-5">
          {/* <Input
            placeholder="Order Name"
            type="text"
            selected={form.name}
            setSelected={(value) => handleChange("name", value)}
          /> */}
          <SelectDropDownImage
            items={customers.map((c) => ({
              ...c,
              name: c.first_name + " " + c.last_name,
            }))}
            selected={form.customer}
            setSelected={(value) => handleChange("customer", value)}
            placeholder="Customer"
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
          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-[#201B1D]">
              Optional Note
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Add any special instruction or internal note for this order"
              className="w-full rounded-xl border border-input bg-card px-3 py-3 text-sm text-[#201B1D] outline-none focus:border-primary"
            />
          </div>

          <div className="col-span-2">
            <MultiSelectDropDown
              items={serviceItems}
              placeholder="Service Items"
              selected={form.items.map((i) => i.service_item)}
              onChange={(item) => {
                const serviceItem = serviceItems.find(
                  (si) => si.id === item.id
                );
                const exists = form.items.find(
                  (i) => i.service_item?.id === item.id
                );
                if (!exists) {
                  setForm({
                    ...form,
                    items: [
                      ...form.items,
                      {
                        service_item: serviceItem,
                        quantity: 1,
                        weight: 1,
                        price: serviceItem.price,
                        subtotal: serviceItem.price,
                      },
                    ],
                  });
                } else {
                  const updated = form.items.filter(
                    (i) => i.service_item?.id !== item.id
                  );
                  setForm({ ...form, items: updated });
                }
              }}
            />
          </div>
        </div>
        {form.items.length > 0 && (
          <div className="px-3 py-2 border-t border-b flex flex-col gap-5 text-xs">
            {form.items.map((itm, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-5">
                  <h4 className="font-semibold">{itm.service_item?.name}</h4>
                  <p className="text-sm">₦{itm.service_item?.price}</p>
                </div>
                <div className="grid grid-cols-2 items-center gap-5">
                  <Input
                    placeholder={
                      itm.service_item?.unit_type === "per_item"
                        ? "Quantity"
                        : "Weight (kg)"
                    }
                    type="number"
                    selected={
                      itm.service_item?.unit_type === "per_item"
                        ? itm.quantity
                        : itm.weight
                    }
                    setSelected={(val) =>
                      handleItemChange(
                        index,
                        itm.service_item?.unit_type === "per_item"
                          ? "quantity"
                          : "weight",
                        val
                      )
                    }
                  />
                  <span className="font-medium justify-self-end text-lg">
                    ₦{itm.subtotal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-lg">Total Amount</h4>
          <span className="font-bold text-xl">₦{form.total_amount}</span>
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
