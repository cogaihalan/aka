import { Metadata } from "next";
import ContactPage from "@/features/storefront/components/contact-page";

export const metadata: Metadata = {
  title: "Contact Us - AKA Store",
  description: "Get in touch with our customer support team.",
};

export default function ContactPageRoute() {
  return <ContactPage />;
}
