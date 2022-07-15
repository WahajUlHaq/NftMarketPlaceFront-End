import { Outlet } from "react-router-dom";

import ItemsLisiting from "../pages/ItemListing";

const SecureRoute = (props) => {
  if (props.user.user.userWalletId) {
    return <Outlet />;
  } else {
    return <ItemsLisiting />;
  }
};

export default SecureRoute;
