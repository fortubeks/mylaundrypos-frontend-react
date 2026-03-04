import TabHead from "../../utils/TabHead";
import Modal from "../../utils/Modal";
import { useEffect, useState } from "react";
import { cleanUpErr, RequestService } from "../../services";
import toast from "../../utils/Toast";
import ComponentCard from "../../utils/ComponentCard";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../utils/TableItems";
import CreateCustomer from "./utils/CreateCustomer";
import { Button } from "../../utils/Button";
import { Input } from "../../utils/Input";
import { SelectDropDownImage } from "../../utils/SelectDropdownImage";
import { useNavigate, useParams } from "react-router-dom";
import Search from "../../utils/Search";
import { useIsMobile } from "../../utils/use-mobile";
import { FaTrash } from "react-icons/fa";
import { BarLoader } from "../../utils/Loader";
import {
  calculateSubtotal,
  calculateTotal,
  formatDate,
  getInitialForm,
} from "./utils/functions";
import AddPayment from "./utils/AddPayment";

export default function ViewOrder() {
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState({});
  const [item, setItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const isMobile = useIsMobile();

  const isEditing = Boolean(params.id);

  const [form, setForm] = useState(getInitialForm());
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (item) {
      setForm(getInitialForm(item));
    }
  }, [item]);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [customersRes, itemsRes] = await Promise.all([
          RequestService.get("/customers"),
          RequestService.get("/service-items"),
        ]);

        setCustomers(customersRes.data.data.data);
        setServiceItems(itemsRes.data.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDependencies();
  }, []);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await RequestService.get(`/orders/${params.id}`);
      setItem(res.data.data.order);
      setData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditing) return;

    fetchOrder();
  }, [params.id]);

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const updatedItems = prev.items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      );

      updatedItems[index].subtotal = calculateSubtotal(updatedItems[index]);

      return {
        ...prev,
        items: updatedItems,
        total_amount: calculateTotal(updatedItems),
      };
    });
  };

  // const addItem = () => {
  //   setForm((prev) => ({
  //     ...prev,
  //     items: [
  //       ...prev.items,
  //       {
  //         service_item: "",
  //         quantity: "",
  //         weight: "",
  //         price: "",
  //         subtotal: 0,
  //       },
  //     ],
  //   }));
  // };

  // const removeItem = (index) => {
  //   setForm((prev) => {
  //     const updated = prev.items.filter((_, i) => i !== index);
  //     return {
  //       ...prev,
  //       items: updated,
  //       total_amount: calculateTotal(updated),
  //     };
  //   });
  // };

  const validateForm = (form) => {
    const errors = {};

    if (!form.customer) errors.customer = "Customer is required";
    if (!form.order_date) errors.order_date = "Order date is required";
    if (!form.due_date) errors.due_date = "Due date is required";
    if (!form.items?.length)
      errors.items = "At least one service item is required";

    return errors;
  };

  const submit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setShowErrors(true);
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    setLoading(true);

    const payload = {
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
      if (isEditing) {
        await RequestService.put(`/orders/${item.id}`, payload);
      } else {
        await RequestService.post("/orders", payload);
      }

      toast.success(`Order ${isEditing ? "updated" : "created"} successfully`);
      navigate("/dashboard/orders");
    } catch (error) {
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (paymentId) => {
    if (!window.confirm("Delete this payment?")) return;

    try {
      await RequestService.delete(`/orders/payments/${paymentId}`);
      toast.success("Payment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete payment");
    }
  };

  if (loading) {
    return (
      <div className="h-full grow flex items-center justify-center">
        <BarLoader />
      </div>
    );
  }

  return (
    <main className="h-full grow flex flex-col border border-[#E7E7E7] overflow-y-auto">
      <TabHead name="Update Orders"></TabHead>
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
                si.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((tm) => {
                return (
                  <div
                    key={tm.id}
                    className="p-3 border rounded cursor-pointer hover:shadow"
                    onClick={() => {
                      const exists = form.items.find(
                        (i) => i.service_item?.id === tm.id,
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
                  name: `${c.first_name} ${
                    c.last_name ? c.last_name + " " : ""
                  }`,
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
                            val,
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
                          (i, idx) => idx !== index,
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
      <div className="px-5 md:px-10" onClick={() => console.log(data, item)}>
        <ComponentCard
          title="Payments"
          desc="View and manage payments made for this order, including payment dates, amounts, and modes of payment."
        >
          <Table>
            <TableHeader className="border-b border-gray-100">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-medium text-start"
                >
                  Payment Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-medium text-start"
                >
                  Mode of Payment
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-medium text-start"
                >
                  Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-3 font-medium text-start"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {item?.payments?.map((payment, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <TableCell className="px-2 py-2 text-start">
                    <span>{formatDate(payment.created_at)}</span>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-start">
                    {payment.mode_of_payment}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-start">
                    ₦{payment.amount}
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => deletePayment(payment.id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableRow className="bg-gray-50 dark:bg-white/5 ">
              <TableCell className="px-2 py-3 font-medium text-end">
                Total Paid
              </TableCell>
              <TableCell className="px-2 py-3 font-medium text-start">
                ₦{data?.total_payment}
              </TableCell>
              <TableCell className="px-2 py-3 font-medium text-start">
                Outstanding:
              </TableCell>
              <TableCell className="px-2 py-3 font-medium text-start">
                ₦{data?.amount_due ?? 0}
              </TableCell>
            </TableRow>
          </Table>
          <div className="flex justify-between items-center">
            <Button
              name={"Add Payment"}
              width="fit"
              onClick={() => setShowAddPaymentModal(true)}
              loading={loading}
            />
          </div>
        </ComponentCard>
      </div>
      {showModal && (
        <Modal
          child={<CreateCustomer setShowModal={setShowModal} fetch={fetch} />}
        />
      )}
      {showAddPaymentModal && (
        <Modal
          child={
            <AddPayment
              order={data?.order}
              fetch={fetchOrder}
              setShowModal={setShowAddPaymentModal}
            />
          }
        />
      )}
    </main>
  );
}
