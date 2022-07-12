import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Items from "../pages/Items";
import SecureRoute from "./SecureRoute";
import ItemsLisiting from "../pages/ItemListing";

const Router = () => {
  const user = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact={true} path="/" element={<Login />} />
        <Route element={<SecureRoute user={user} />}>
          <Route exact={true} path="/home" element={<Home />} />
          <Route exact={true} path="/my-items" element={<Items />} />
          <Route exact={true} path="/items-for-sale" element={<ItemsLisiting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
