import { Button } from "../../utils/Button";
import { Input, PasswordInput } from "../join";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isVerified } from "../../store/slices/userSlice";
import { cleanUpErr, AuthService, UserService } from "../../services";
import { useDispatch } from "react-redux";
import toast from "../../utils/Toast";
import Switch from "react-switch";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
    } else {
      return true;
    }
  };

  const handleCheck = () => {
    setRememberMe(!rememberMe);
  };

  const navigateAndClearHistory = (route) => {
    navigate(route, { replace: true });
    window.history.replaceState(null, "", route);

    window.history.pushState(null, "", route);

    const handlePopState = () => {
      window.history.pushState(null, "", route);
      window.removeEventListener("popstate", handlePopState);
    };

    window.addEventListener("popstate", handlePopState);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    if (!password) return toast.error("Password is required");

    setLoading(true);
    try {
      const login = await AuthService.login({
        email,
        password,
      });

      localStorage.setItem(
        "laundry::auth",
        JSON.stringify({
          token: login?.data?.data?.token,
          userId: login?.data?.data?.user.id,
        })
      );

      await UserService.getUser();

      setLoading(false);
      toast.success("Login Successful");

      const route =
        // ? "/dashboard/get-started"
        "/dashboard/dashboard";

      dispatch(isVerified(true));
      navigateAndClearHistory(route);
    } catch (error) {
      console.log(error);
      setLoading(false);
      cleanUpErr(error);
    }
  };

  return (
    <div className="bg-white w-full rounded-xl flex flex-col gap-5 p-5 md:p-7">
      <div className="flex mx-auto -mt-5 -translate-y-10 text-white bg-black rounded-xl w-full py-10 justify-center items-center">
        <h3 className="text-3xl font-bold">Sign In</h3>
      </div>
      <form className="flex flex-col w-full gap-5 grow">
        <Input
          name="Email address"
          type="email"
          placeholder="e.g johndoe@gmail.com"
          value={email}
          setValue={setEmail}
        />
        <PasswordInput
          name="Password"
          placeholder="*********"
          value={password}
          setValue={setPassword}
        />
        <div className="flex items-center">
          <Switch
            onChange={handleCheck}
            checked={rememberMe}
            onColor={"#008aff"}
            offColor="#F6F6F6"
            checkedIcon={false}
            uncheckedIcon={false}
            height={20}
            width={40}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)"
            handleDiameter={16}
            activeBoxShadow="0px 0px 1px 2px #be1c2d"
          />
          <label className="text-sm text-gray-500 ms-3 dark:text-neutral-400">
            Remember me
          </label>
        </div>
        <div className="w-full flex flex-col gap-2 items-center justify-center mt-auto mb-4">
          <Button
            name="Login"
            width="100%"
            onClick={submit}
            disabled={email && password}
            loading={loading}
          />
        </div>
      </form>
      <div className="flex gap-5 w-full justify-between items-center text-sm">
        <p
          className="flex gap-1 underline cursor-pointer justify-end"
          onClick={() =>
            navigate("/login/forgot-password", { state: { email } })
          }
        >
          Forgot Password?
        </p>
        <nav className="flex items-center gap-1 font-normal">
          Don’t have an Account?{" "}
          <Link to="/register" className="inline font-bold">
            Create Account
          </Link>
        </nav>
      </div>
    </div>
  );
}
