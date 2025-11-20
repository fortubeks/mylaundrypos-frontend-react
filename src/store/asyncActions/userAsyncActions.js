import api, { cleanUpErr, cleanUpResponse } from "../helper";
import {
  updateUser,
  updateMessage,
  isError,
  isLoading,
  isVerified,
} from "../slices/userSlice";

export const login = (credentials) => (dispatch) => {
  try {
    const response = Request.login(credentials);
    const data = cleanUpResponse(response);
    const { user } = data;
    const auth = {
      token: data.token,
      userId: user.id,
    };
    localStorage.setItem("::auth", JSON.stringify(auth));
    dispatch(updateUser(user));
    dispatch(isVerified());
    return data
  } catch (error) {
    const err = cleanUpErr(error);
    return err
  }
};

export const logout = () => (dispatch) => {
  dispatch(isLoading());
  api
    .post(`/admin/logout`)
    .then((res) => {
      const data = cleanUpResponse(res);
      const { message } = data;
      dispatch(updateMessage(message));
    })
    .catch((res) => {
      const err = cleanUpErr(res);
      const message = err?.message;
      dispatch(isError(message ? message : res.message));
    });
};
