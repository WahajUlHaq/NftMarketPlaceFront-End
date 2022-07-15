import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "../pages/Home";
import Items from "../pages/Items";
import SecureRoute from "./SecureRoute";
import ItemsLisiting from "../pages/ItemListing";

const Router = () => {
  const user = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact={true} path="/" element={<ItemsLisiting />} />
        <Route exact={true} path="/items-for-sale" element={<ItemsLisiting />} />
        <Route element={<SecureRoute user={user} />}>
          <Route exact={true} path="/my-items" element={<Items />} />
          <Route exact={true} path="/mint-nft" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
