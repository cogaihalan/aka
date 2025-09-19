import { Metadata } from "next";
import AboutPage from "@/features/storefront/components/about-page";

export const metadata: Metadata = {
  title: "About Us - AKA Store",
  description: "Learn more about AKA Store and our commitment to quality.",
};

export default function AboutPageRoute() {
  return <AboutPage />;
}
