import { apiClient } from "@/lib/api/client-mock";
import type {
  Customer,
  CustomerListResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  QueryParams,
  Address,
} from "@/lib/api/types";

export class UnifiedCustomerService {
  private basePath = "/admin/customers";

  // Get all customers with filtering and pagination
  async getCustomers(params: QueryParams = {}): Promise<CustomerListResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await apiClient.get<CustomerListResponse>(endpoint);
    return response.data!;
  }

  // Get a single customer by ID
  async getCustomer(id: number): Promise<Customer> {
    const response = await apiClient.get<Customer>(`${this.basePath}/${id}`);
    return response.data!;
  }

  // Get customer by email
  async getCustomerByEmail(email: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(
      `${this.basePath}/email/${encodeURIComponent(email)}`
    );
    return response.data!;
  }

  // Create a new customer
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    const response = await apiClient.post<Customer>(this.basePath, data);
    return response.data!;
  }

  // Update an existing customer
  async updateCustomer(
    id: number,
    data: UpdateCustomerRequest
  ): Promise<Customer> {
    const response = await apiClient.put<Customer>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  // Partially update a customer
  async patchCustomer(
    id: number,
    data: Partial<UpdateCustomerRequest>
  ): Promise<Customer> {
    const response = await apiClient.patch<Customer>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  // Delete a customer (soft delete)
  async deleteCustomer(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  // Customer status management
  async activateCustomer(id: number): Promise<Customer> {
    const response = await apiClient.patch<Customer>(
      `${this.basePath}/${id}/activate`
    );
    return response.data!;
  }

  async deactivateCustomer(id: number): Promise<Customer> {
    const response = await apiClient.patch<Customer>(
      `${this.basePath}/${id}/deactivate`
    );
    return response.data!;
  }

  async banCustomer(id: number, reason?: string): Promise<Customer> {
    const response = await apiClient.patch<Customer>(
      `${this.basePath}/${id}/ban`,
      { reason }
    );
    return response.data!;
  }

  async unbanCustomer(id: number): Promise<Customer> {
    const response = await apiClient.patch<Customer>(
      `${this.basePath}/${id}/unban`
    );
    return response.data!;
  }

  // Customer addresses
  async getCustomerAddresses(customerId: number): Promise<Address[]> {
    const response = await apiClient.get<Address[]>(
      `${this.basePath}/${customerId}/addresses`
    );
    return response.data!;
  }

  async addCustomerAddress(
    customerId: number,
    address: Omit<Address, "id">
  ): Promise<Address> {
    const response = await apiClient.post<Address>(
      `${this.basePath}/${customerId}/addresses`,
      address
    );
    return response.data!;
  }

  async updateCustomerAddress(
    customerId: number,
    addressId: number,
    address: Partial<Address>
  ): Promise<Address> {
    const response = await apiClient.put<Address>(
      `${this.basePath}/${customerId}/addresses/${addressId}`,
      address
    );
    return response.data!;
  }

  async deleteCustomerAddress(
    customerId: number,
    addressId: number
  ): Promise<void> {
    await apiClient.delete(
      `${this.basePath}/${customerId}/addresses/${addressId}`
    );
  }

  async setDefaultAddress(
    customerId: number,
    addressId: number
  ): Promise<Customer> {
    const response = await apiClient.patch<Customer>(
      `${this.basePath}/${customerId}/default-address`,
      { addressId }
    );
    return response.data!;
  }

  // Customer preferences
  async updateCustomerPreferences(
    customerId: number,
    preferences: Partial<Customer["preferences"]>
  ): Promise<Customer> {
    const response = await apiClient.patch<Customer>(
      `${this.basePath}/${customerId}/preferences`,
      preferences
    );
    return response.data!;
  }

  // Customer tags
  async addCustomerTag(customerId: number, tag: string): Promise<Customer> {
    const response = await apiClient.post<Customer>(
      `${this.basePath}/${customerId}/tags`,
      { tag }
    );
    return response.data!;
  }

  async removeCustomerTag(customerId: number, tag: string): Promise<Customer> {
    const response = await apiClient.delete<Customer>(
      `${this.basePath}/${customerId}/tags/${encodeURIComponent(tag)}`
    );
    return response.data!;
  }

  // Customer orders
  async getCustomerOrders(
    customerId: number,
    params: QueryParams = {}
  ): Promise<any> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/${customerId}/orders?${queryString}`
      : `${this.basePath}/${customerId}/orders`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Customer analytics
  async getCustomerAnalytics(customerId: number): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: string;
    customerLifetimeValue: number;
    orderHistory: any[];
  }> {
    const response = await apiClient.get(
      `${this.basePath}/${customerId}/analytics`
    );
    return response.data!;
  }

  // Customer search
  async searchCustomers(
    query: string,
    filters?: QueryParams
  ): Promise<CustomerListResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append("q", query);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `${this.basePath}/search?${queryString}`;

    const response = await apiClient.get<CustomerListResponse>(endpoint);
    return response.data!;
  }

  // Bulk operations
  async bulkUpdateCustomers(
    updates: Array<{ id: number; data: Partial<UpdateCustomerRequest> }>
  ): Promise<Customer[]> {
    const response = await apiClient.patch<Customer[]>(
      `${this.basePath}/bulk`,
      { updates }
    );
    return response.data!;
  }

  async bulkDeleteCustomers(ids: number[]): Promise<void> {
    await apiClient.request(`${this.basePath}/bulk`, {
      method: "DELETE",
      body: { ids },
    });
  }

  async bulkAddTags(
    customerIds: number[],
    tags: string[]
  ): Promise<Customer[]> {
    const response = await apiClient.post<Customer[]>(
      `${this.basePath}/bulk/tags`,
      { customerIds, tags }
    );
    return response.data!;
  }

  // Customer import/export
  async exportCustomers(
    format: "csv" | "xlsx" = "csv",
    filters?: QueryParams
  ): Promise<Blob> {
    const searchParams = new URLSearchParams();
    searchParams.append("format", format);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/export?${queryString}`
      : `${this.basePath}/export`;

    const response = await fetch(apiClient["buildUrl"](endpoint), {
      headers: await apiClient["getAuthHeaders"](),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async importCustomers(
    file: File
  ): Promise<{ success: number; errors: any[] }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{ success: number; errors: any[] }>(
      `${this.basePath}/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data!;
  }

  // Customer communication
  async sendEmailToCustomer(
    customerId: number,
    subject: string,
    message: string,
    templateId?: string
  ): Promise<void> {
    await apiClient.post(`${this.basePath}/${customerId}/send-email`, {
      subject,
      message,
      templateId,
    });
  }

  async sendSmsToCustomer(customerId: number, message: string): Promise<void> {
    await apiClient.post(`${this.basePath}/${customerId}/send-sms`, {
      message,
    });
  }

  // Customer groups/segments
  async getCustomerGroups(): Promise<any[]> {
    const response = await apiClient.get(`${this.basePath}/groups`);
    return response.data!;
  }

  async createCustomerGroup(data: {
    name: string;
    description?: string;
    criteria: any;
  }): Promise<any> {
    const response = await apiClient.post(`${this.basePath}/groups`, data);
    return response.data!;
  }

  async addCustomersToGroup(
    groupId: number,
    customerIds: number[]
  ): Promise<void> {
    await apiClient.post(`${this.basePath}/groups/${groupId}/customers`, {
      customerIds,
    });
  }

  async removeCustomersFromGroup(
    groupId: number,
    customerIds: number[]
  ): Promise<void> {
    await apiClient.request(`${this.basePath}/groups/${groupId}/customers`, {
      method: "DELETE",
      body: { customerIds },
    });
  }
}

// Export singleton instance
export const unifiedCustomerService = new UnifiedCustomerService();
