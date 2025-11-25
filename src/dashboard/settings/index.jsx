import TabHead from "../../utils/TabHead";
import { useSelector } from "react-redux";
import Info from "./utils/Info";
import { useState } from "react";
import DeleteAcct from "./utils/DeleteAcct";
import toast from "../../utils/Toast";
import { cleanUpErr, UserService } from "../../services";
import ChangePassword from "./utils/ChangePassword";

export default function Index() {
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);

  const validatePassword = (password) => {
    const errors = [];
    if (!/[A-Z]/.test(password)) errors.push("uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("special character");
    setPasswordErrors(errors);
    if (errors.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validate = validatePassword(newPassword);
      if (!validate) {
        toast.error("Password not strong enough");
        setLoading(false);
        return;
      }
      if (newPassword !== rePassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }
      const update = await UserService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: rePassword,
      });
      console.log(update);
      toast.success("Password updated");
      setOldPassword("");
      setNewPassword("");
      setRePassword("");
    } catch (error) {
      console.log(error);
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const update = await UserService.updateUser({
        name,
        email,
      });
      console.log(update);
      toast.success("User info updated");
    } catch (error) {
      console.log(error);
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-[20px]">
      <TabHead name="Settings" size="14px"></TabHead>
      <div className="flex flex-col overflow-y-auto p-5 gap-5">
        <div className="flex flex-col md:grid grid-cols-2 gap-5">
          <Info
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            user={user}
            updateUserInfo={updateUserInfo}
            loading={loading}
          />
          <ChangePassword
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            rePassword={rePassword}
            setRePassword={setRePassword}
            errors={passwordErrors}
            updatePassword={updatePassword}
            loading={loading}
          />
        </div>
        <DeleteAcct loading={loading} setLoading={setLoading} />
      </div>
    </div>
  );
}
