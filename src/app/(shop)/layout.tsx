// import Navbar from "@/components/Navbar/Navbar";
import ShopLayout from "@/layouts/ShopLayout";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ShopLayout>
      <main>{children}</main>
    </ShopLayout>
  );
};

export default Layout;
