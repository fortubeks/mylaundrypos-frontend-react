import { Logout } from "../utils/Logout";
import toast from "../utils/Toast";

export function cleanUpResponse(res) {
  const response = res.data;
  return response;
}

export function cleanUpErr(res) {
  let response;
  if (
    res?.response?.status === 401 &&
    res?.response?.data?.message === "Authentication invalid"
  ) {
    Logout("Session Expired, Login to continue", "/login");
  }
  // if (
  //   res?.response?.status === 429 ||
  //   res?.response?.status === 500 ||
  //   res?.response?.status === 408
  // ) {
  //   toast.error("Something went wrong, we are currently checking it out");
  // }

  response =
    typeof res?.response?.data?.error === "string"
      ? res.response.data.error
      : typeof res?.response?.data?.errors === "object"
        ? Object.values(res.response.data.errors).flat().join(", ")
        : typeof res?.response?.data?.message === "string"
          ? res.response.data.message
          : JSON.stringify(res?.response?.data);
  console.log(response);
  toast.error(response);
}
