"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";

const addresses = [
  {
    id: 1,
    name: "Home",
    fullName: "John Doe",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    isDefault: true,
  },
  {
    id: 2,
    name: "Work",
    fullName: "John Doe",
    address: "456 Business Ave",
    city: "New York",
    state: "NY",
    zip: "10002",
    isDefault: false,
  },
];

export default function AddressBookPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Address Book</h1>
          <p className="text-muted-foreground">
            Manage your shipping addresses
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{address.name}</CardTitle>
              {address.isDefault && <Badge variant="default">Default</Badge>}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{address.fullName}</p>
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
