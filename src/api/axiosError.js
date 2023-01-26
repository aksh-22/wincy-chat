// import { errorToast } from "utils/toast";
import store from "../redux/store";
export const axiosError = (err) => {
  if (err.response) {
    if (err.response.status === 401) {
      if (err.response?.data?.path === "/auth/login") {
        alert(err.response.data.message);
      } else {
        store.dispatch({
          type: "SESSION_EXPIRED",
          payload: true,
        });
      }

      return;
      // localStorage.removeItem("access_token");
      // window.location.href = "/login";
      //   errorToast();
      //   errorToast(err.response.data.message);
      // store.disp
    }
    if (err.response.data.message) {
      alert(err.response.data.message);
    }

    console.error("unauthorized", err.response.headers);
    throw err;
  } else {
    console.error("err", err.message);
    err.message !== "Network Error" && alert(err.message);
    throw err;
  }
};
