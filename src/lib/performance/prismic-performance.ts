import { PrismicPerformanceMetrics } from '@/types/prismic';

export class PrismicPerformanceMonitor {
  private static metrics: PrismicPerformanceMetrics[] = [];
  private static maxMetrics = 1000; // Keep only last 1000 operations

  static recordMetric(operation: string, duration: number, success: boolean, cacheHit = false) {
    const metric: PrismicPerformanceMetrics = {
      operation,
      duration,
      timestamp: Date.now(),
      success,
      cache_hit: cacheHit
    };

    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      const status = success ? '✅' : '❌';
      const cache = cacheHit ? ' (cached)' : '';
      console.log(`${status} Prismic ${operation}: ${duration.toFixed(2)}ms${cache}`);
    }
  }

  static getMetrics() {
    return this.metrics;
  }

  static getAverageDuration(operation?: string) {
    const filtered = operation 
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filtered.length === 0) return 0;

    const total = filtered.reduce((sum, metric) => sum + metric.duration, 0);
    return total / filtered.length;
  }

  static getSuccessRate(operation?: string) {
    const filtered = operation 
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filtered.length === 0) return 0;

    const successful = filtered.filter(m => m.success).length;
    return (successful / filtered.length) * 100;
  }

  static getCacheHitRate(operation?: string) {
    const filtered = operation 
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filtered.length === 0) return 0;

    const cached = filtered.filter(m => m.cache_hit).length;
    return (cached / filtered.length) * 100;
  }

  static getSlowestOperations(limit = 10) {
    return this.metrics
      .filter(m => m.success)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  static getRecentErrors(limit = 10) {
    return this.metrics
      .filter(m => !m.success)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  static clearMetrics() {
    this.metrics = [];
  }

  static getSummary() {
    const total = this.metrics.length;
    const successful = this.metrics.filter(m => m.success).length;
    const cached = this.metrics.filter(m => m.cache_hit).length;
    const averageDuration = this.getAverageDuration();
    const successRate = this.getSuccessRate();
    const cacheHitRate = this.getCacheHitRate();

    return {
      total_operations: total,
      successful_operations: successful,
      cached_operations: cached,
      average_duration_ms: Math.round(averageDuration * 100) / 100,
      success_rate_percent: Math.round(successRate * 100) / 100,
      cache_hit_rate_percent: Math.round(cacheHitRate * 100) / 100,
      slowest_operations: this.getSlowestOperations(5),
      recent_errors: this.getRecentErrors(5)
    };
  }
}

// Performance testing utilities
export class PrismicPerformanceTester {
  static async testOperation(
    name: string,
    operation: () => Promise<any>,
    iterations = 5
  ) {
    const results = [];
    
    console.log(`🧪 Testing ${name} (${iterations} iterations)...`);
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      try {
        await operation();
        const end = performance.now();
        const duration = end - start;
        
        results.push({ success: true, duration });
        PrismicPerformanceMonitor.recordMetric(name, duration, true);
        
        console.log(`  ✅ Iteration ${i + 1}: ${duration.toFixed(2)}ms`);
      } catch (error) {
        const end = performance.now();
        const duration = end - start;
        
        results.push({ success: false, duration, error });
        PrismicPerformanceMonitor.recordMetric(name, duration, false);
        
        console.log(`  ❌ Iteration ${i + 1}: ${duration.toFixed(2)}ms - ${error}`);
      }
    }

    const successful = results.filter(r => r.success);
    const averageDuration = successful.length > 0 
      ? successful.reduce((sum, r) => sum + r.duration, 0) / successful.length
      : 0;
    const successRate = (successful.length / results.length) * 100;

    console.log(`📊 ${name} Results:`);
    console.log(`  Average Duration: ${averageDuration.toFixed(2)}ms`);
    console.log(`  Success Rate: ${successRate.toFixed(1)}%`);
    console.log(`  Successful: ${successful.length}/${results.length}`);

    return {
      name,
      iterations,
      successful: successful.length,
      failed: results.length - successful.length,
      average_duration: averageDuration,
      success_rate: successRate,
      results
    };
  }

  static async runFullTest() {
    console.log('🚀 Starting Prismic Performance Test Suite...\n');
    
    const { prismicApiService } = await import('@/lib/api/prismic-service');
    
    const tests = [
      {
        name: 'getPages',
        operation: () => prismicApiService.getPages(1, 10)
      },
      {
        name: 'getAllContent',
        operation: () => prismicApiService.getAllContent()
      },
      {
        name: 'getCategories',
        operation: () => prismicApiService.getCategories()
      },
      {
        name: 'getStaticPages',
        operation: () => prismicApiService.getStaticPages()
      }
    ];

    const results = [];
    
    for (const test of tests) {
      const result = await this.testOperation(test.name, test.operation, 3);
      results.push(result);
      console.log(''); // Empty line for readability
    }

    console.log('📈 Performance Test Summary:');
    console.log('============================');
    
    results.forEach(result => {
      console.log(`${result.name}:`);
      console.log(`  Duration: ${result.average_duration.toFixed(2)}ms`);
      console.log(`  Success: ${result.success_rate.toFixed(1)}%`);
      console.log(`  Results: ${result.successful}/${result.iterations}`);
    });

    const summary = PrismicPerformanceMonitor.getSummary();
    console.log('\n📊 Overall Performance Summary:');
    console.log('==============================');
    console.log(`Total Operations: ${summary.total_operations}`);
    console.log(`Average Duration: ${summary.average_duration_ms}ms`);
    console.log(`Success Rate: ${summary.success_rate_percent}%`);
    console.log(`Cache Hit Rate: ${summary.cache_hit_rate_percent}%`);

    return { results, summary };
  }
}
