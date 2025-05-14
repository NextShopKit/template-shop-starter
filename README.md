# 🛍️ NextShopKit Template – Shop Starter

This is a **starter template for demonstrating the usage of the [NextShopKit SDK](https://github.com/NextShopKit/sdk)** in a real-world, headless e-commerce frontend.

Built with **Next.js 14 App Router**, it provides a fully functional Shopify-integrated storefront including:

- Product listing and detail pages
- Cart functionality with state management
- Dynamic variant handling
- Styled with **Tailwind CSS** and **ShadCN UI**
- Built-in context providers (e.g., `CartProvider`)

---

## 🚀 What is NextShopKit?

[NextShopKit](https://github.com/NextShopKit/sdk) is a flexible SDK for building **Shopify-powered storefronts with Next.js**. It abstracts the Storefront API and provides:

- 🔍 Product and collection fetching (`getProducts`, `getProduct`)
- 🛒 Cart utilities (`addToCart`, `getCart`, `updateCartItem`)
- 🧱 Strong TypeScript typings for Shopify models
- 🧠 Custom metafield parsing and transformation
- 🛠️ Hooks and context providers for client-side cart management

---

## 📦 Features in This Template

- ✅ Pre-wired with `@nextshopkit/pro` or `pro-development` SDK
- ✅ Context-based cart with `useCart()` and `CartProvider`
- ✅ Product page with variant selection and dynamic pricing
- ✅ Image galleries using `next/image`
- ✅ Clean layout structure (navbar, page shell, layout hierarchy)

---

## 🧪 Try It Out

```bash
git clone https://github.com/NextShopKit/template-shop-starter.git
cd template-shop-starter
pnpm install
pnpm dev
```

> Make sure to add your own `.env` with Shopify Storefront credentials:
>
> ```env
> NEXT_PUBLIC_SHOPIFY_DOMAIN=your-shop.myshopify.com
> NEXT_PUBLIC_STOREFRONT_TOKEN=your-access-token
> ```

---

## 🧱 Folder Structure

```
components/
  Navbar/
  ProductHeader/
layouts/
  ShopLayout.tsx
lib/
  nextshopkit/
    product.ts         # Wrapper for getProduct
    ...
providers/
  CartProvider.tsx     # Wraps NextShopKit CartProvider
```

---

## 🛠 Customize It

Feel free to modify:

- **Styling:** Tailwind + ShadCN components
- **State:** Replace the cart with your own logic or integrate with your CMS
- **APIs:** Extend the SDK with custom metafield handling

---

## 📄 License

MIT — use freely for commercial or personal projects.

---

## 💬 Questions?

Open an issue or reach out at [github.com/NextShopKit](https://github.com/NextShopKit)
