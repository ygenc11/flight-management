import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ScrollIndicator from "./ScrollIndicator";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <Outlet />
      </main>
      <ScrollIndicator />
    </>
  );
};

export default Layout;
