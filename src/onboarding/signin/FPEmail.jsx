import { Button } from "../../utils/Button";
import { Input } from "../join";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { AuthService, cleanUpErr } from "../../services";
import toast from "../../utils/Toast";

export default function FPEmail() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
    } else {
      return true;
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    setLoading(true);
    try {
      const response = await AuthService.initiatePasswordReset({ email });
      console.log("Password reset initiation response:", response);

      toast.success("Password reset email sent");
      navigate("/login/forgot-password-sent", {
        state: {
          email,
        },
      });
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.errors) {
        const firstError = error.response.data.errors[0];
        toast.error(firstError);
        return;
      }
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full rounded-xl flex flex-col md:gap-5 p-5 md:p-7">
      <div className="flex mx-auto -mt-5 -translate-y-10 text-white bg-black rounded-xl w-full py-10 justify-center items-center">
        <h3 className="text-3xl font-bold">Forgot Password</h3>
      </div>
      <form className="flex flex-col w-full gap-5 grow">
        <p className="text-center text-sm">
          Enter your email address below and {`we'll`} send you an otp to reset
          your password.
        </p>
        <Input
          name="Email address"
          type="email"
          placeholder="e.g johndoe@gmail.com"
          value={email}
          setValue={setEmail}
        />
        <div className="w-full flex flex-col gap-2 items-center justify-center mt-auto mb-4">
          <Button
            name="Send Reset Link"
            width="100%"
            onClick={submit}
            disabled={email}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
}
