import { useState } from "react";
import cancel from "../../../assets/icons/close.svg";
import { Button } from "../../../utils/Button";
import { Input } from "../../../utils/Input";
import toast from "../../../utils/Toast";
import { cleanUpErr, RequestService } from "../../../services";

export default function AddUpdate({ setShowCreate, item, fetch }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(item?.name || "");
  
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name,
    };
    try {
      let response;
      if (item) {
        response = await RequestService.put(
          `/laundry-items/${item.id}`,
          payload
        );
      } else {
        response = await RequestService.post("/laundry-items", payload);
      }
      console.log(response);
      fetch();
      toast.success(`Laundry item ${item ? "updated" : "added"} successfully`);
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
          {item ? "Update Laundry Item" : "Add Laundry Item"}
          <img
            src={cancel}
            alt=""
            className="absolute right-1 cursor-pointer"
            onClick={() => setShowCreate(false)}
          />
        </h4>
        <p className="text-sm text-muted-foreground">
          {item
            ? "Update the details of this laundry item"
            : "Fill the form to add a new laundry item"}
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
        </div>
        <div className="w-full flex flex-col gap-2 items-center justify-center mt-auto mb-4">
          <Button
            name={item ? "Update Laundry Item" : "Add Laundry Item"}
            width="100%"
            onClick={submit}
            loading={loading}
          />
        </div>
      </form>
    </main>
  );
}
