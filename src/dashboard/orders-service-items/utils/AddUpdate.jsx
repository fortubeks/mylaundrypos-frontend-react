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
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({} || null);
  const [serviceItems, setServiceItems] = useState([]);
  const [serviceItem, setServiceItem] = useState({} || null);
  const [quantity, setQuantity] = useState(item?.quantity || "");
  const [weight, setWeight] = useState(item?.weight || "");
  const [subtotal, setSubtotal] = useState(item?.subtotal || "");

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await RequestService.get("/orders");
        const responseItems = await RequestService.get("/service-items");
        setOrders(response.data.data.data);
        setServiceItems(responseItems.data.data.data);
        if (item) {
          const orderItem = response.data.data.data.find(
            (o) => o.id === item.order_id
          );
          const serviceItemItem = responseItems.data.data.data.find(
            (si) => si.id === item.service_item_id
          );
          setOrder(orderItem);
          setServiceItem(serviceItemItem);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    // calculate subtotal by quantity * price OR weight * price
    let calculatedSubtotal = null;
    if (serviceItem && (quantity !== "" || weight !== "")) {
      if (serviceItem.unit_type === "per_item") {
        setWeight("");
        calculatedSubtotal = (quantity || 0) * serviceItem.price;
      } else if (serviceItem.unit_type === "per_kg") {
        setQuantity("");
        calculatedSubtotal = (weight || 0) * serviceItem.price;
      }
    }
    setSubtotal(calculatedSubtotal);
  }, [quantity, weight, serviceItem]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: name,
      order_id: order?.id,
      service_item_id: serviceItem?.id,
      quantity: quantity,
      weight: weight,
      price: serviceItem?.price || 0,
      subtotal: subtotal,
    };
    try {
      let response;
      if (item) {
        response = await RequestService.put(
          `/orders-service-items/${item.id}`,
          payload
        );
      } else {
        response = await RequestService.post("/orders-service-items", payload);
      }
      console.log(response);
      fetch();
      toast.success(
        `Order Service Item ${item ? "updated" : "added"} successfully`
      );
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
          {item ? "Update Order Service Item" : "Add Order Service Item"}
          <img
            src={cancel}
            alt=""
            className="absolute right-1 cursor-pointer"
            onClick={() => setShowCreate(false)}
          />
        </h4>
        <p className="text-sm text-muted-foreground">
          {item
            ? "Update the details of this order service item"
            : "Fill the form to add a new order service item"}
        </p>
      </div>
      <form className="flex flex-col w-full gap-5 grow px-3 mt-5">
        <div className="flex flex-col gap-5">
          <Input
            placeholder="Order Service Item Name"
            type="text"
            selected={name}
            setSelected={setName}
          />
          <SelectDropDownImage
            items={orders}
            selected={order}
            setSelected={setOrder}
            placeholder="Order"
          />
          <SelectDropDownImage
            items={serviceItems}
            selected={serviceItem}
            setSelected={setServiceItem}
            placeholder="Service Item"
          />
          <Input
            placeholder="Quantity"
            type="number"
            selected={quantity}
            setSelected={setQuantity}
            disabled={serviceItem?.unit_type === "per_kg"}
          />
          <Input
            placeholder="Weight"
            type="number"
            selected={weight}
            setSelected={setWeight}
            disabled={serviceItem?.unit_type === "per_item"}
          />
          <Input
            placeholder="Price"
            type="number"
            selected={serviceItem?.price || ""}
            setSelected={() => {}}
            disabled={true}
          />
          <Input
            placeholder="Subtotal"
            type="number"
            selected={subtotal}
            setSelected={() => {}}
            disabled={true}
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
