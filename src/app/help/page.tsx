import { Metadata } from "next";
import HelpPage from "@/features/storefront/components/help-page";

export const metadata: Metadata = {
  title: "Help Center - AKA Store",
  description: "Find answers to common questions and get support.",
};

export default function HelpPageRoute() {
  return <HelpPage />;
}
