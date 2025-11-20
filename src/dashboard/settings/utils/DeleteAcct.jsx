import { Input } from "../../../utils/Input";
import { useSelector } from "react-redux";
import { useState } from "react";
import { ButtonSecondary } from "../../../utils/Button";
import { UserService } from "../../../services";
import { Logout } from "../../../utils/Logout";
import toast from "../../../utils/Toast";

export default function DeleteAcct({ loading, setLoading }) {
  const user = useSelector((state) => state.user.user);
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await UserService.deleteAccount();

      console.log(response);
      Logout();
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-8 flex flex-col md:grid grid-cols-2 border rounded-[20px]">
      <div className="flex flex-col gap-2">
        <b className="text-lg font-semibold">Delete Account</b>
        <p className="text-xs pr-14">
          You can delete your account by entering <b>{user?.name}</b> and
          confirming the deletion. The account will be deleted and access
          revoked.
        </p>
      </div>
      <div className="flex flex-col items-end gap-3">
        <label className="flex flex-col gap-1 w-full">
          <span>First Name</span>
          <Input
            selected={name}
            setSelected={setName}
            placeholder={"Enter name"}
          />
        </label>
        <ButtonSecondary
          name="Delete Account"
          disabled={user?.name === name}
          onClick={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
