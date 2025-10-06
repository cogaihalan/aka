import { Metadata } from "next";
import CheckoutSuccessPage from "@/features/storefront/components/checkout/checkout-success-page";

export const metadata: Metadata = {
  title: "Order Confirmed - AKA Store",
  description: "Thank you for your purchase! Your order has been confirmed.",
};

export default function CheckoutSuccessPageRoute() {
  return <CheckoutSuccessPage />;
}
