"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Eye } from "lucide-react";
import Link from "next/link";

const orders = [
  {
    id: "AKA-2024-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 215.98,
    items: 2,
  },
  {
    id: "AKA-2024-002",
    date: "2024-01-10",
    status: "Shipped",
    total: 149.99,
    items: 1,
  },
  {
    id: "AKA-2024-003",
    date: "2024-01-05",
    status: "Processing",
    total: 89.99,
    items: 3,
  },
];

export default function OrderHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.items} item{order.items > 1 ? "s" : ""} • $
                      {order.total}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      order.status === "Delivered"
                        ? "default"
                        : order.status === "Shipped"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
