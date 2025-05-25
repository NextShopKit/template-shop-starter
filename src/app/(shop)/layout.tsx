import ShopLayout from "@/layouts/ShopLayout";
import React from "react";

/**
 * Layout wrapper for all shop-related pages in the NextShopKit starter.
 * Uses ShopLayout to provide consistent navigation and structure for product, collection, and search pages.
 * ShopLayout includes the main Navbar and any shared UI for the shop experience.
 */
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
