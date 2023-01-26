import { useMutation, useQueryClient } from "react-query";

import { logout } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export const useLogout = () => {
  const queryClient = useQueryClient();

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, mutate } = useMutation(logout, {
    onSettled: () => {
      dispatch({ type: "Logout" });
      queryClient.clear();
      navigate("/", { replace: true });
    },
  });
  return { isLoading, mutate };
};
