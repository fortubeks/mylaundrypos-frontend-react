import { useEffect, useState } from "react";
import cancel from "../../../assets/icons/close.svg";
import { Button } from "../../../utils/Button";
import { Input } from "../../../utils/Input";
import toast from "../../../utils/Toast";
import { SelectDropDownImage } from "../../../utils/SelectDropdownImage";
import { cleanUpErr, RequestService } from "../../../services";

export default function AddUpdate({ setShowCreate, item, fetch }) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(item?.category || null);
  const [laundryItem, setLaundryItem] = useState(item?.laundry_item || null);
  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(Number(item?.price) || "");
  const [unitType, setUnitType] = useState(
    item
      ? {
          name: item?.unit_type
            ? item.unit_type === "per_item"
              ? "Per Item"
              : item.unit_type === "per_kg"
              ? "Per Kg"
              : ""
            : "",
          value: item?.unit_type || "",
        }
      : null
  );
  const [turnaroundTime, setTurnaroundTime] = useState(
    item?.turnaround_time || ""
  );
  const [serviceCategories, setServiceCategories] = useState([]);
  const [laundryItems, setLaundryItems] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await RequestService.get("/service-categories");
        setServiceCategories(response.data.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await RequestService.get("/laundry-items");
        const laundryItems = res.data.data.data;
        setLaundryItems(laundryItems);
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
      service_category_id: category?.id || null,
      laundry_item_id: laundryItem?.id || null,
      name,
      price,
      unit_type: unitType.value,
      turnaround_time: turnaroundTime,
    };
    try {
      let response;
      if (item) {
        response = await RequestService.put(
          `/service-items/${item.id}`,
          payload
        );
      } else {
        response = await RequestService.post("/service-items", payload);
      }
      console.log(response);
      fetch();
      toast.success(`Service item ${item ? "updated" : "added"} successfully`);
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
          {item ? "Update Service Item" : "Add Service Item"}
          <img
            src={cancel}
            alt=""
            className="absolute right-1 cursor-pointer"
            onClick={() => setShowCreate(false)}
          />
        </h4>
        <p className="text-sm text-muted-foreground">
          {item
            ? "Update the details of this service item"
            : "Fill the form to add a new service item"}
        </p>
      </div>
      <form className="flex flex-col w-full gap-5 grow px-3 mt-5">
        <div className="flex flex-col gap-5">
          <Input
            placeholder="Name"
            type="text"
            selected={name}
            setSelected={setName}
          />
          <Input
            placeholder="Price (₦)"
            type="number"
            selected={price}
            setSelected={setPrice}
          />
          <SelectDropDownImage
            items={serviceCategories}
            selected={category}
            setSelected={setCategory}
            placeholder="Service Category"
          />
          <SelectDropDownImage
            items={laundryItems}
            selected={laundryItem}
            setSelected={setLaundryItem}
            placeholder="Laundry Item"
          />
          <SelectDropDownImage
            items={[
              { name: "Per Item", value: "per_item" },
              { name: "Per Kg", value: "per_kg" },
            ]}
            selected={unitType}
            setSelected={setUnitType}
            placeholder="Unit Type"
          />
          <Input
            placeholder="Turnaround Time"
            type="number"
            selected={turnaroundTime}
            setSelected={setTurnaroundTime}
          />
        </div>
        <div className="w-full flex flex-col gap-2 items-center justify-center mt-auto mb-4">
          <Button
            name={item ? "Update Service Item" : "Add Service Item"}
            width="100%"
            onClick={submit}
            loading={loading}
          />
        </div>
      </form>
    </main>
  );
}
