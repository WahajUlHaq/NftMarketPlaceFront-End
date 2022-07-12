import { Outlet } from "react-router-dom";
import Login from "../pages/Login";
import web3Object from "../web3/web3";

const SecureRoute = (props) => {
  if (props.user.user.userWalletId) {
    return <Outlet />;
  } else {
    return <Login />;
  }
};

export default SecureRoute;
