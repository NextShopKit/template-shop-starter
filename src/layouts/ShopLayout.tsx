"use client";
import Navbar from "@/components/Navbar/Navbar";
import React, { Fragment } from "react";

interface ShopLayoutProps {
  children: React.ReactNode;
}

const ShopLayout = ({ children }: ShopLayoutProps) => {
  return (
    <Fragment>
      <Navbar />
      {children}
    </Fragment>
  );
};

export default ShopLayout;
