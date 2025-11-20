import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button, CircularLoader } from "../../utils/Button";
import OTPInput, { ResendOTP } from "otp-input-react";
import React, { useState } from "react";
import toast from "../../utils/Toast";
import { AuthService, cleanUpErr } from "../../services";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [resendKey, setResendKey] = useState(0);
  const [otp, setOtp] = useState("");

  const { name, email } = location.state || {};

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.resendVerificationEmail({ email });
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

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await AuthService.verifyEmail({ email, otp });
      console.log("Verification response:", response);
      toast.success("Email verified successfully!");
      navigate("/login", { state: { name, email } });
    } catch (error) {
      console.error("Error verifying email:", error);
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  if (!name || !email) {
    return <Navigate to="/" />;
  }

  return (
    <main
      className="h-screen overflow-hidden flex justify-center items-center relative bg-cover bg-center bg-no-repeat before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[rgba(52,71,103,0.6)] before:z-0"
      style={{
        backgroundImage: `url(${"https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"})`,
      }}
    >
      <section className="z-10 md:w-1/2 flex justify-center items-center">
        <div className="bg-white w-full rounded-xl flex flex-col gap-5 p-5 md:p-7">
          <div className="flex mx-auto -mt-5 -translate-y-10 text-white bg-black rounded-xl w-full py-10 justify-center items-center">
            <h3 className="text-3xl font-bold">Account Created</h3>
          </div>
          <form className="flex flex-col w-full gap-5 grow items-center">
            <p className="text-lg mt-2">
              Please check your email for the verification code.
            </p>
            <div className="flex flex-col gap-2">
              <OTPInput
                value={otp}
                onChange={setOtp}
                autoFocus
                OTPLength={6}
                otpType="number"
                disabled={false}
                inputStyles={{
                  border: "1px solid #D1D5DB",
                  background: "#8989890D",
                  height: "65px",
                  width: "65px",
                  fontSize: "22px",
                  borderRadius: "50%",
                  outline: "#201B1D",
                  color: "#000",
                }}
                className="flex gap-2 justify-center"
              />
            </div>

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
                        {`Didn't`} receive code?{" "}
                        <b className="underline">Resend</b>
                      </span>
                    )}
                    {loading && <CircularLoader />}
                  </button>
                );
              }}
            />
            <div className="w-full flex justify-center my-auto mb-14">
              <Button name="Verify" width="50%" onClick={handleVerify} />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
