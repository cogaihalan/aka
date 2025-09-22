"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Truck, Shield, RotateCcw } from "lucide-react";
import Link from "next/link";
import { FeaturedProductSlider } from "@/components/product/featured-product-slider";
import FullWidthBanner from "@/components/full-width-banner";

export default function StorefrontHomePage() {
    return (
        <div className="space-y-12">
            {/* Hero Section - Full Width */}
            <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                <FullWidthBanner />
            </div>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <Truck className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">Free Shipping</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Free shipping on orders over $50. Fast and reliable delivery to
                            your doorstep.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">Secure Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Your payment information is secure with our encrypted checkout
                            process.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <RotateCcw className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">Easy Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            30-day return policy. Not satisfied? Return it for a full refund.
                        </CardDescription>
                    </CardContent>
                </Card>
            </section>

            {/* Featured Products */}
            <FeaturedProductSlider
                products={[
                    {
                        id: 50,
                        name: "Premium Wireless Headphones",
                        description:
                            "High-quality wireless headphones with noise cancellation",
                        price: 199.99,
                        compareAtPrice: 249.99,
                        rating: 4.8,
                        image: "",
                        category: "Electronics",
                        inStock: true,
                    },
                    {
                        id: 51,
                        name: "Smart Fitness Watch",
                        description:
                            "Track your fitness goals with this advanced smartwatch",
                        price: 299.99,
                        rating: 4.6,
                        image: "",
                        category: "Wearables",
                        inStock: true,
                    },
                    {
                        id: 52,
                        name: "Gaming Mechanical Keyboard",
                        description: "Professional gaming keyboard with RGB lighting",
                        price: 149.99,
                        compareAtPrice: 179.99,
                        rating: 4.9,
                        image: "",
                        category: "Gaming",
                        inStock: true,
                    },
                    {
                        id: 53,
                        name: "Bluetooth Speaker",
                        description: "Portable wireless speaker with 360-degree sound",
                        price: 89.99,
                        compareAtPrice: 119.99,
                        rating: 4.7,
                        image: "",
                        category: "Audio",
                        inStock: true,
                    },
                    {
                        id: 54,
                        name: "Smart Home Hub",
                        description: "Control all your smart devices from one place",
                        price: 199.99,
                        rating: 4.4,
                        image: "",
                        category: "Smart Home",
                        inStock: true,
                    },
                    {
                        id: 55,
                        name: "Wireless Mouse",
                        description: "Ergonomic wireless mouse with precision tracking",
                        price: 59.99,
                        rating: 4.6,
                        image: "",
                        category: "Accessories",
                        inStock: true,
                    },
                    {
                        id: 56,
                        name: "USB-C Hub",
                        description:
                            "Expand your laptop's connectivity with multiple ports",
                        price: 49.99,
                        compareAtPrice: 69.99,
                        rating: 4.3,
                        image: "",
                        category: "Accessories",
                        inStock: true,
                    },
                ]}
                title="Featured Products"
                showViewAll={true}
                viewAllHref="/products"
            />
        </div>
    );
}
