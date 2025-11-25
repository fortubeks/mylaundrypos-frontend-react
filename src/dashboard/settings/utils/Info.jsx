import { Button } from "../../../utils/Button";
import { Input } from "../../../utils/Input";
// import { PhoneInput } from "../../../utils/PhoneInput2";
import { useSelector } from "react-redux";

export default function Info({
  name,
  setName,
  email,
  setEmail,
  updateUserInfo,
  loading,
}) {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="w-full p-4 md:p-8 flex flex-col gap-4 border rounded-[20px]">
      <div className="flex flex-col gap-2">
        <b className="text-lg font-semibold">Personal Information</b>
        <p className="text-xs">
          Edit your personal information and save changes anytime
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span>Name</span>
          <Input selected={name} setSelected={setName} />
        </label>
        <label className="flex flex-col gap-1">
          <span>Email Address</span>
          <div className="relative bg-[#F6F6F6] w-full rounded-xl flex items-center">
            <Input selected={email} setSelected={setEmail} />
          </div>
        </label>
      </div>
      <Button
        name="Save Changes"
        onClick={updateUserInfo}
        disabled={name !== user?.name || email !== user?.email}
        loading={loading}
      />
    </div>
  );
}
