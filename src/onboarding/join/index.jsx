import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "../../utils/Button";
import toast from "../../utils/Toast";
import { cleanUpErr, AuthService } from "../../services";
import GoogleButton from "../GoogleButton";
import { Turnstile } from "@marsidev/react-turnstile";

export default function Create() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  // const validatePassword = (password) => {
  //   const errors = [];
  //   if (!/[A-Z]/.test(password)) errors.push("uppercase letter");
  //   if (!/[a-z]/.test(password)) errors.push("lowercase letter");
  //   if (!/[0-9]/.test(password)) errors.push("number");
  //   if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
  //     errors.push("special character");

  //   if (errors.length === 0) return true;
  //   toast.error(`Password must contain ${errors.join(", ")}`);
  // };

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
    if (!name) return toast.error("Name is required");
    if (!validateEmail(email)) return;
    // if (!phone) return toast.error("Phone number is required");
    // if (!validatePassword(password)) return;
    if (password.length < 5)
      return toast.error("Password must be at least 5 characters long");
    if (password !== rePassword) return toast.error("Passwords do not match");

    if (!captchaToken) {
      return toast.error("Please verify you're not a robot.");
    }
    setLoading(true);
    try {
      const register = await AuthService.register({
        email,
        password,
        name,
        phone,
        state: state || null,
        referral_source: referralSource || null,
        captcha: captchaToken,
      });
      console.log(register);

      ["laundry::auth", "::auth", "hiddenTime"].forEach((key) =>
        localStorage.removeItem(key),
      );

      setLoading(false);
      toast.success("Registration Successful");
      navigate("/verify", {
        state: {
          name,
          email,
        },
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error?.response?.data?.errors) {
        const firstError = error.response.data.errors[0];
        toast.error(firstError);
        return;
      }
      cleanUpErr(error);
    }
  };

  return (
    <main
      className=" p-5 md:p-14 overflow-auto flex justify-center items-center relative bg-cover bg-center bg-no-repeat before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[rgba(52,71,103,0.6)] before:z-0"
      style={{
        backgroundImage: `url(${"https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"})`,
      }}
    >
      <section className="z-10 h-full py-10 w-full md:w-1/2 flex justify-center items-center">
        <div className="bg-white w-full rounded-xl flex flex-col md:gap-5 p-5 md:p-7">
          <div className="flex mx-auto -mt-5 -translate-y-10 text-white bg-black rounded-xl w-full py-10 justify-center items-center">
            <h3 className="text-3xl font-bold">Sign Up</h3>
          </div>
          <form className="flex flex-col w-full gap-5 grow">
            <Input
              name="Name"
              type="text"
              placeholder="e.g John Doe"
              value={name}
              setValue={setName}
            />
            <div className="flex flex-col md:grid grid-cols-2 gap-5">
              <Input
                name="Email address"
                type="email"
                placeholder="e.g johndoe@gmail.com"
                value={email}
                setValue={setEmail}
              />
              <Input
                name="Phone Number"
                type="tel"
                placeholder="e.g +1234567890"
                value={phone}
                setValue={setPhone}
              />
            </div>
            <div className="flex flex-col md:grid grid-cols-2 gap-5">
              <Input
                name="State / City"
                type="text"
                placeholder="e.g Lagos"
                value={state}
                setValue={setState}
              />
              <div className="flex flex-col gap-2 w-full">
                <label
                  htmlFor="referral_source"
                  className="text-sm font-normal"
                >
                  How did you find us? (Optional)
                </label>
                <select
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className="bg-inherit border border-[#E0E0E0] rounded-xl px-4 h-10 placeholder:text-[#9D9D9D] text-sm"
                >
                  <option value="">Select an option...</option>
                  <option value="google_ads">Google Ads</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="friend">From a Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <input
              type="text"
              name="company_name"
              style={{ display: "none" }}
            ></input>
            <div className="flex flex-col md:grid grid-cols-2 gap-5">
              <PasswordInput
                name="Password"
                placeholder="*********"
                value={password}
                setValue={setPassword}
              />
              <PasswordInput
                name="Re-enter Password"
                placeholder="*********"
                value={rePassword}
                setValue={setRePassword}
              />
            </div>
            <Turnstile
              siteKey={import.meta.env.VITE_API_TURNSTILE_SITE_KEY}
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
            />
            <div className="w-full flex flex-col gap-3 items-center justify-center mt-auto mb-4">
              <Button
                name="Sign Up"
                width="100%"
                onClick={submit}
                disabled={
                  name &&
                  email &&
                  phone &&
                  password &&
                  rePassword &&
                  password === rePassword
                }
                loading={loading}
              />
              <GoogleButton />
            </div>
          </form>
          <div className="flex gap-5 w-full justify-center items-center text-sm">
            <nav className="flex items-center gap-1 font-normal">
              Already have an Account?{" "}
              <Link to="/login" className="inline font-bold">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}

export const Input = ({
  name,
  type = "text",
  placeholder,
  value,
  setValue,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={name} className="text-sm font-normal ">
        {name}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        name={name}
        className="bg-inherit border border-[#E0E0E0] rounded-xl px-4 h-10 placeholder:text-[#9D9D9D] text-sm"
      />
    </div>
  );
};

export const PasswordInput = ({ name, placeholder, value, setValue }) => {
  const [showP, setShowP] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor="password" className="text-sm font-normal text-[#626262]">
        {name}
      </label>
      <div className=" rounded-xl h-fit relative flex items-center ">
        <input
          type={showP ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-inherit border border-[#E0E0E0] w-full rounded-xl px-4 h-10 placeholder:text-[#9D9D9D] text-sm"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowP(!showP);
          }}
          className="text-[#626262] absolute right-4"
        >
          {showP ? <FaEyeSlash className="" /> : <FaEye className="" />}
        </button>
      </div>
    </div>
  );
};
