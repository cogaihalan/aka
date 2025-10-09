import { createClient } from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";

// Prismic repository configuration
export const repositoryName =
  process.env.PRISMIC_REPOSITORY_NAME || "your-repo-name";

// Route configuration for Prismic content
export const routes = [
  { type: "homepage", path: "/" },
  { type: "page", path: "/pages/:uid" },
  { type: "blog_post", path: "/blog/:uid" },
];

// Performance-optimized Prismic client
export function createPrismicClient(config = {}) {
  const client = createClient(repositoryName, {
    routes,
    fetchOptions: {
      // Production optimizations
      next:
        process.env.NODE_ENV === "production"
          ? {
              tags: ["prismic"],
              revalidate: 3600, // 1 hour cache
            }
          : {
              revalidate: 5, // 5 seconds in development
            },
    },
    ...config,
  });

  // Enable auto-previews in development
  if (process.env.NODE_ENV === "development") {
    enableAutoPreviews({ client });
  }

  return client;
}

// Default client instance
export const prismicClient = createPrismicClient();

// Performance monitoring wrapper
export class PrismicPerformanceMonitor {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static async measureFetch<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();

    try {
      const result = await fn();
      const end = performance.now();

      if (process.env.NODE_ENV === "development") {
        console.log(`🚀 Prismic ${operation}: ${(end - start).toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const end = performance.now();
      console.error(
        `❌ Prismic ${operation} failed: ${(end - start).toFixed(2)}ms`,
        error
      );
      throw error;
    }
  }

  static getCached(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  static setCached(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static clearCache() {
    this.cache.clear();
  }
}

// Enhanced client with performance monitoring
export class OptimizedPrismicClient {
  private client = prismicClient;

  async getByUID<T = any>(type: any, uid: string, options: any = {}) {
    const cacheKey = `${type}-${uid}`;
    const cached = PrismicPerformanceMonitor.getCached(cacheKey);

    if (cached) {
      return cached;
    }

    return PrismicPerformanceMonitor.measureFetch(
      `getByUID(${type}, ${uid})`,
      async () => {
        const result = await this.client.getByUID(type, uid, options);
        PrismicPerformanceMonitor.setCached(cacheKey, result);
        return result;
      }
    );
  }

  async getAllByType<T = any>(type: any, options: any = {}) {
    const cacheKey = `all-${type}`;
    const cached = PrismicPerformanceMonitor.getCached(cacheKey);

    if (cached) {
      return cached;
    }

    return PrismicPerformanceMonitor.measureFetch(
      `getAllByType(${type})`,
      async () => {
        const result = await this.client.getAllByType(type, options);
        PrismicPerformanceMonitor.setCached(cacheKey, result);
        return result;
      }
    );
  }

  async getByID<T = any>(id: string, options: any = {}) {
    return PrismicPerformanceMonitor.measureFetch(`getByID(${id})`, () =>
      this.client.getByID(id, options)
    );
  }

  async getSingle<T = any>(type: string, options: any = {}) {
    return PrismicPerformanceMonitor.measureFetch(`getSingle(${type})`, () =>
      this.client.getSingle(type as any, options)
    );
  }

  // Clear cache method
  clearCache() {
    PrismicPerformanceMonitor.clearCache();
  }
}

// Export optimized client instance
export const optimizedPrismicClient = new OptimizedPrismicClient();
