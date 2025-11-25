import TabHead from "../../utils/TabHead";
import Modal from "../../utils/Modal";
import { useEffect, useState } from "react";
import { cleanUpErr, RequestService } from "../../services";
import toast from "../../utils/Toast";
import CreateCustomer from "./utils/CreateCustomer";
import { Button } from "../../utils/Button";
import { Input } from "../../utils/Input";
import { SelectDropDownImage } from "../../utils/SelectDropdownImage";
import { useLocation, useNavigate } from "react-router-dom";
import Search from "../../utils/Search";
import { useIsMobile } from "../../utils/use-mobile";
import { FaTrash } from "react-icons/fa";

export default function CreateOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

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
  useEffect(() => {
    fetch();
  }, []);

  const validateForm = (form) => {
    const errors = {};

    if (!form.customer) {
      errors.customer = "Customer is required";
    }
    if (!form.order_date || form.order_date.trim() === "") {
      errors.order_date = "Order date is required";
    }
    if (!form.due_date || form.due_date.trim() === "") {
      errors.due_date = "Due date is required";
    }
    const items = Array.isArray(form.items) ? form.items : [];

    const missingServiceItem = items.length === 0;

    if (missingServiceItem) {
      errors.items = "Service item is required";
    }

    return errors;
  };

  const [errors, setErrors] = useState({});
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const newErrors = validateForm(form);
    setErrors(newErrors);
    setIsFormComplete(Object.keys(newErrors).length === 0);
    setShowErrors(false);
  }, [form]);

  const submit = async (e) => {
    e.preventDefault();
    if (!isFormComplete) {
      setShowErrors(true);
      toast.error(errors[Object.keys(errors)[0]]);
      return;
    }
    setLoading(true);
    const payload = {
      // name: form.name,
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
      navigate("/dashboard/orders");
    } catch (error) {
      console.log(error);
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-full grow flex flex-col border border-[#E7E7E7] overflow-y-auto">
      <TabHead name="Create Orders"></TabHead>
      <div className="p-5 w-full flex flex-col md:grid grid-cols-2 gap-5 md:gap-10">
        <div className="flex flex-col gap-5 p-5 border rounded-xl overflow-y-auto h-fit shadow md:sticky top-0">
          <Search
            value={search}
            setValue={setSearch}
            placeholder="Search service item..."
            width={isMobile ? "w-full" : "w-1/3"}
          />
          <div className="grid grid-cols-3 gap-5 max-h-[50vh] md:max-h-[80vh] overflow-y-auto">
            {serviceItems
              .filter((si) =>
                si.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((tm) => {
                return (
                  <div
                    key={tm.id}
                    className="p-3 border rounded cursor-pointer hover:shadow"
                    onClick={() => {
                      const exists = form.items.find(
                        (i) => i.service_item?.id === tm.id
                      );
                      if (!exists) {
                        setForm({
                          ...form,
                          items: [
                            ...form.items,
                            {
                              service_item: tm,
                              quantity: 1,
                              weight: 1,
                              price: tm.price,
                              subtotal: tm.price,
                            },
                          ],
                        });
                      } else {
                        const updated = form.items.map((i) => {
                          if (i.service_item?.id === tm.id) {
                            const updateKey =
                              i.service_item.unit_type === "per_item"
                                ? "quantity"
                                : "weight";
                            const newValue = i[updateKey] + 1;
                            return {
                              ...i,
                              [updateKey]: newValue,
                              subtotal: newValue * i.price,
                            };
                          }
                          return i;
                        });
                        setForm({ ...form, items: updated });
                      }
                    }}
                  >
                    <h4 className="font-semibold">{tm.name}</h4>
                    <p className="text-sm">₦{tm.price}</p>
                  </div>
                );
              })}
          </div>
        </div>
        <form className="flex flex-col w-full gap-5 grow border rounded-xl p-5 shadow">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1 mb-2">
              <button
                className="text-primary font-medium w-fit text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                Add customer +
              </button>
              <SelectDropDownImage
                items={customers.map((c) => ({
                  ...c,
                  name: c.first_name + " " + c.last_name,
                }))}
                selected={form.customer}
                setSelected={(value) => handleChange("customer", value)}
                placeholder="Customer"
                error={errors.customer}
                showErrors={showErrors}
              />
            </div>
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
            <div className="grid grid-cols-2 gap-5">
              <Input
                placeholder="Order Date"
                type="date"
                selected={form.order_date}
                setSelected={(value) => handleChange("order_date", value)}
                error={errors.order_date}
                showErrors={showErrors}
              />
              <Input
                placeholder="Due Date"
                type="date"
                selected={form.due_date}
                setSelected={(value) => handleChange("due_date", value)}
                error={errors.due_date}
                showErrors={showErrors}
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
                  <div className="flex items-center gap-5">
                    <div className="w-1/2">
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
                    </div>
                    <span className="font-medium justify-self-end text-lg ml-auto">
                      ₦{itm.subtotal}
                    </span>
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => {
                        const updatedItems = form.items.filter(
                          (i, idx) => idx !== index
                        );
                        setForm({ ...form, items: updatedItems });
                      }}
                    >
                      <FaTrash />
                    </button>
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
      </div>
      {showModal && (
        <Modal
          child={<CreateCustomer setShowModal={setShowModal} fetch={fetch} />}
        />
      )}
    </main>
  );
}
