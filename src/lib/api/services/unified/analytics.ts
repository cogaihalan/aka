import { apiClient } from "@/lib/api/client-mock";
import type {
  AnalyticsResponse,
  AnalyticsOverview,
  SalesData,
  TopProduct,
  CustomerAnalytics,
  QueryParams,
} from "@/lib/api/types";

class UnifiedAnalyticsService {
  private basePath = "/api/analytics";

  // Dashboard overview
  async getOverview(period?: string): Promise<AnalyticsOverview> {
    const endpoint = period
      ? `${this.basePath}/overview?period=${period}`
      : `${this.basePath}/overview`;

    const response = await apiClient.get<AnalyticsOverview>(endpoint);
    return response.data!;
  }

  // Sales analytics
  async getSalesData(
    period: string = "30d",
    granularity: "day" | "week" | "month" = "day"
  ): Promise<SalesData[]> {
    const response = await apiClient.get<SalesData[]>(
      `${this.basePath}/sales?period=${period}&granularity=${granularity}`
    );
    return response.data!;
  }

  async getSalesByCategory(
    period?: string,
    limit: number = 10
  ): Promise<Array<{ category: string; revenue: number; orders: number }>> {
    const searchParams = new URLSearchParams();
    if (period) searchParams.append("period", period);
    searchParams.append("limit", limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `${this.basePath}/sales/category?${queryString}`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  async getSalesByRegion(
    period?: string
  ): Promise<Array<{ region: string; revenue: number; orders: number }>> {
    const endpoint = period
      ? `${this.basePath}/sales/region?period=${period}`
      : `${this.basePath}/sales/region`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Product analytics
  async getTopProducts(
    period?: string,
    limit: number = 10
  ): Promise<TopProduct[]> {
    const searchParams = new URLSearchParams();
    if (period) searchParams.append("period", period);
    searchParams.append("limit", limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `${this.basePath}/products/top?${queryString}`;

    const response = await apiClient.get<TopProduct[]>(endpoint);
    return response.data!;
  }

  async getProductPerformance(
    productId: number,
    period?: string
  ): Promise<{
    views: number;
    orders: number;
    revenue: number;
    conversionRate: number;
    averageOrderValue: number;
  }> {
    const endpoint = period
      ? `${this.basePath}/products/${productId}?period=${period}`
      : `${this.basePath}/products/${productId}`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  async getLowStockProducts(threshold?: number): Promise<any[]> {
    const endpoint = threshold
      ? `${this.basePath}/products/low-stock?threshold=${threshold}`
      : `${this.basePath}/products/low-stock`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Customer analytics
  async getCustomerAnalytics(period?: string): Promise<CustomerAnalytics> {
    const endpoint = period
      ? `${this.basePath}/customers?period=${period}`
      : `${this.basePath}/customers`;

    const response = await apiClient.get<CustomerAnalytics>(endpoint);
    return response.data!;
  }

  async getCustomerSegments(): Promise<
    Array<{
      segment: string;
      count: number;
      revenue: number;
      averageOrderValue: number;
    }>
  > {
    const response = await apiClient.get(`${this.basePath}/customers/segments`);
    return response.data!;
  }

  async getCustomerLifetimeValue(
    customerId?: number,
    period?: string
  ): Promise<{
    customerId?: number;
    lifetimeValue: number;
    totalOrders: number;
    averageOrderValue: number;
    firstOrderDate: string;
    lastOrderDate: string;
  }> {
    const searchParams = new URLSearchParams();
    if (customerId) searchParams.append("customerId", customerId.toString());
    if (period) searchParams.append("period", period);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/customers/lifetime-value?${queryString}`
      : `${this.basePath}/customers/lifetime-value`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Order analytics
  async getOrderAnalytics(period?: string): Promise<{
    totalOrders: number;
    averageOrderValue: number;
    orderGrowth: number;
    refundRate: number;
    fulfillmentTime: number;
  }> {
    const endpoint = period
      ? `${this.basePath}/orders?period=${period}`
      : `${this.basePath}/orders`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  async getOrderStatusDistribution(period?: string): Promise<
    Array<{
      status: string;
      count: number;
      percentage: number;
    }>
  > {
    const endpoint = period
      ? `${this.basePath}/orders/status?period=${period}`
      : `${this.basePath}/orders/status`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  async getFulfillmentMetrics(period?: string): Promise<{
    averageFulfillmentTime: number;
    onTimeDeliveryRate: number;
    shippingCosts: number;
    returnRate: number;
  }> {
    const endpoint = period
      ? `${this.basePath}/orders/fulfillment?period=${period}`
      : `${this.basePath}/orders/fulfillment`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Revenue analytics
  async getRevenueAnalytics(period?: string): Promise<{
    totalRevenue: number;
    revenueGrowth: number;
    averageOrderValue: number;
    revenueByChannel: Array<{ channel: string; revenue: number }>;
    revenueByPaymentMethod: Array<{
      method: string;
      revenue: number;
    }>;
  }> {
    const endpoint = period
      ? `${this.basePath}/revenue?period=${period}`
      : `${this.basePath}/revenue`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  async getRevenueTrends(
    period: string = "12m",
    granularity: "day" | "week" | "month" = "month"
  ): Promise<
    Array<{
      date: string;
      revenue: number;
      orders: number;
      averageOrderValue: number;
    }>
  > {
    const response = await apiClient.get(
      `${this.basePath}/revenue/trends?period=${period}&granularity=${granularity}`
    );
    return response.data!;
  }

  // Marketing analytics
  async getMarketingMetrics(period?: string): Promise<{
    totalVisitors: number;
    conversionRate: number;
    bounceRate: number;
    averageSessionDuration: number;
    trafficSources: Array<{
      source: string;
      visitors: number;
      conversions: number;
    }>;
  }> {
    const endpoint = period
      ? `${this.basePath}/marketing?period=${period}`
      : `${this.basePath}/marketing`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  async getCampaignPerformance(period?: string): Promise<
    Array<{
      campaign: string;
      impressions: number;
      clicks: number;
      conversions: number;
      revenue: number;
      roi: number;
    }>
  > {
    const endpoint = period
      ? `${this.basePath}/marketing/campaigns?period=${period}`
      : `${this.basePath}/marketing/campaigns`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Inventory analytics
  async getInventoryAnalytics(): Promise<{
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalInventoryValue: number;
    turnoverRate: number;
  }> {
    const response = await apiClient.get(`${this.basePath}/inventory`);
    return response.data!;
  }

  async getInventoryTurnover(period?: string): Promise<
    Array<{
      product: string;
      sku: string;
      turnoverRate: number;
      daysInStock: number;
      stockValue: number;
    }>
  > {
    const endpoint = period
      ? `${this.basePath}/inventory/turnover?period=${period}`
      : `${this.basePath}/inventory/turnover`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Custom reports
  async createCustomReport(data: {
    name: string;
    description?: string;
    metrics: string[];
    dimensions: string[];
    filters?: any;
    period?: string;
  }): Promise<{ id: number; name: string }> {
    const response = await apiClient.post(`${this.basePath}/reports`, data);
    return response.data!;
  }

  async getCustomReports(): Promise<
    Array<{
      id: number;
      name: string;
      description?: string;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    const response = await apiClient.get(`${this.basePath}/reports`);
    return response.data!;
  }

  async getCustomReport(id: number): Promise<any> {
    const response = await apiClient.get(`${this.basePath}/reports/${id}`);
    return response.data!;
  }

  async updateCustomReport(
    id: number,
    data: Partial<{
      name: string;
      description: string;
      metrics: string[];
      dimensions: string[];
      filters: any;
    }>
  ): Promise<any> {
    const response = await apiClient.put(
      `${this.basePath}/reports/${id}`,
      data
    );
    return response.data!;
  }

  async deleteCustomReport(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/reports/${id}`);
  }

  async runCustomReport(id: number): Promise<any> {
    const response = await apiClient.post(`${this.basePath}/reports/${id}/run`);
    return response.data!;
  }

  // Export analytics
  async exportAnalytics(
    type: "overview" | "sales" | "customers" | "products" | "orders",
    format: "csv" | "xlsx" | "pdf" = "csv",
    period?: string,
    filters?: QueryParams
  ): Promise<Blob> {
    const searchParams = new URLSearchParams();
    searchParams.append("type", type);
    searchParams.append("format", format);
    if (period) searchParams.append("period", period);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `${this.basePath}/export?${queryString}`;

    const response = await fetch(apiClient["buildUrl"](endpoint), {
      headers: await apiClient["getAuthHeaders"](),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Real-time analytics
  async getRealTimeMetrics(): Promise<{
    activeUsers: number;
    currentOrders: number;
    revenueToday: number;
    topPages: Array<{ page: string; views: number }>;
  }> {
    const response = await apiClient.get(`${this.basePath}/realtime`);
    return response.data!;
  }

  // Comparative analytics
  async getComparativeAnalytics(
    currentPeriod: string,
    previousPeriod: string
  ): Promise<{
    revenue: { current: number; previous: number; change: number };
    orders: { current: number; previous: number; change: number };
    customers: { current: number; previous: number; change: number };
    averageOrderValue: { current: number; previous: number; change: number };
  }> {
    const response = await apiClient.get(
      `${this.basePath}/compare?current=${currentPeriod}&previous=${previousPeriod}`
    );
    return response.data!;
  }
}

// Export singleton instance
export const unifiedAnalyticsService = new UnifiedAnalyticsService();
