import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button, CircularLoader } from "../../utils/Button";
import { Input, PasswordInput } from "../join";
import React, { useState } from "react";
import { ResendOTP } from "otp-input-react";
import { AuthService, cleanUpErr } from "../../services";
import toast from "../../utils/Toast";

export default function FPNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendKey, setResendKey] = useState(0);

  const { email } = location.state || {};

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.resendOtp({ email });
      console.log("Resend verification email response:", response);
      toast.success("Verification email resent successfully!");
      setResendKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.resetPassword({
        email,
        otp,
        new_password: newPassword,
        new_password_confirmation: repeatPassword,
      });
      console.log("Password reset response:", response);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-white w-full rounded-xl flex flex-col gap-5 p-5 md:p-7">
      <div className="flex mx-auto -mt-5 -translate-y-10 text-white bg-black rounded-xl w-full py-10 justify-center items-center">
        <h3 className="text-3xl font-bold">Password Reset</h3>
      </div>
      <form className="flex flex-col w-full gap-5 grow">
        <p className="text-center text-sm">
          We have sent a otp to <b>{email}</b>. Please check your inbox and
          enter the OTP and new password to reset your password.
        </p>
        <Input
          name="OTP"
          type="text"
          placeholder="Enter the OTP"
          value={otp}
          setValue={setOtp}
        />
        <PasswordInput
          name="Password"
          placeholder="*********"
          value={newPassword}
          setValue={setNewPassword}
        />
        <PasswordInput
          name="Repeat New Password"
          placeholder="Repeat new password"
          value={repeatPassword}
          setValue={setRepeatPassword}
        />
        <ResendOTP
          key={resendKey}
          renderTime={() => React.Fragment}
          renderButton={(buttonProps) => {
            return (
              <button
                className="min-w-fit text-sm underline ml-auto flex items-center justify-center gap-2 relative cursor-pointer"
                disabled={loading || buttonProps.remainingTime !== 0}
                onClick={handleResend}
              >
                {buttonProps.remainingTime !== 0 ? (
                  `Resend code in ${buttonProps.remainingTime} sec`
                ) : (
                  <span>
                    {`Didn't`} receive code? <b className="underline">Resend</b>
                  </span>
                )}
                {loading && <CircularLoader />}
              </button>
            );
          }}
        />
        <div className="w-full flex flex-col gap-2 items-center justify-center mt-auto mb-4">
          <Button
            name="Reset Password"
            width="100%"
            onClick={submit}
            disabled={
              otp &&
              newPassword &&
              repeatPassword &&
              newPassword === repeatPassword
            }
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
}
