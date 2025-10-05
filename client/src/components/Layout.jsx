import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-[70px]">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
