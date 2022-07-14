import { Outlet } from "react-router-dom";
import Login from "../pages/Login";

const SecureRoute = (props) => {
  if (props.user.user.userWalletId) {
    return <Outlet />;
  } else {
    return <Login />;
  }
};

export default SecureRoute;
