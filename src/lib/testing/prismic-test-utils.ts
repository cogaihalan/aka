import { PrismicPerformanceTester } from '@/lib/performance/prismic-performance';
import { prismicApiService } from '@/lib/api/prismic-service';

export class PrismicTestUtils {
  // Test individual operations
  static async testGetPages() {
    return PrismicPerformanceTester.testOperation(
      'getPages',
      () => prismicApiService.getPages(1, 10),
      3
    );
  }

  static async testGetAllContent() {
    return PrismicPerformanceTester.testOperation(
      'getAllContent',
      () => prismicApiService.getAllContent(),
      2
    );
  }

  static async testGetCategories() {
    return PrismicPerformanceTester.testOperation(
      'getCategories',
      () => prismicApiService.getCategories(),
      3
    );
  }

  static async testGetStaticPages() {
    return PrismicPerformanceTester.testOperation(
      'getStaticPages',
      () => prismicApiService.getStaticPages(),
      3
    );
  }

  static async testGetBlogPosts() {
    return PrismicPerformanceTester.testOperation(
      'getBlogPosts',
      () => prismicApiService.getBlogPosts(1, 10),
      3
    );
  }

  static async testSearchContent() {
    return PrismicPerformanceTester.testOperation(
      'searchContent',
      () => prismicApiService.searchContent('test', 'page'),
      3
    );
  }

  // Test cache performance
  static async testCachePerformance() {
    console.log('🧪 Testing Cache Performance...\n');
    
    const testOperation = async (name: string, operation: () => Promise<any>) => {
      console.log(`Testing ${name} (first call - cold cache):`);
      const start1 = performance.now();
      await operation();
      const end1 = performance.now();
      const coldDuration = end1 - start1;
      
      console.log(`Testing ${name} (second call - warm cache):`);
      const start2 = performance.now();
      await operation();
      const end2 = performance.now();
      const warmDuration = end2 - start2;
      
      const improvement = ((coldDuration - warmDuration) / coldDuration) * 100;
      
      console.log(`  Cold: ${coldDuration.toFixed(2)}ms`);
      console.log(`  Warm: ${warmDuration.toFixed(2)}ms`);
      console.log(`  Improvement: ${improvement.toFixed(1)}%\n`);
      
      return { coldDuration, warmDuration, improvement };
    };

    const results = await Promise.all([
      testOperation('getPages', () => prismicApiService.getPages(1, 10)),
      testOperation('getCategories', () => prismicApiService.getCategories()),
      testOperation('getStaticPages', () => prismicApiService.getStaticPages()),
    ]);

    const averageImprovement = results.reduce((sum, r) => sum + r.improvement, 0) / results.length;
    console.log(`📊 Average Cache Improvement: ${averageImprovement.toFixed(1)}%`);

    return results;
  }

  // Test error handling
  static async testErrorHandling() {
    console.log('🧪 Testing Error Handling...\n');
    
    const errorTests = [
      {
        name: 'Invalid UID',
        operation: () => prismicApiService.getPageByUID('invalid-uid-that-does-not-exist')
      },
      {
        name: 'Invalid Type',
        operation: () => prismicApiService.getAllByType('invalid-type')
      }
    ];

    for (const test of errorTests) {
      console.log(`Testing ${test.name}:`);
      try {
        await test.operation();
        console.log('  ❌ Expected error but operation succeeded');
      } catch (error) {
        console.log(`  ✅ Error handled correctly: ${error.message}`);
      }
    }
  }

  // Test concurrent operations
  static async testConcurrentOperations() {
    console.log('🧪 Testing Concurrent Operations...\n');
    
    const operations = [
      () => prismicApiService.getPages(1, 5),
      () => prismicApiService.getCategories(),
      () => prismicApiService.getStaticPages(),
      () => prismicApiService.getBlogPosts(1, 5),
    ];

    console.log('Running 4 operations concurrently...');
    const start = performance.now();
    
    try {
      const results = await Promise.all(operations.map(op => op()));
      const end = performance.now();
      const duration = end - start;
      
      console.log(`✅ All operations completed in ${duration.toFixed(2)}ms`);
      console.log(`Results: ${results.map(r => Array.isArray(r) ? r.length : 'object').join(', ')}`);
      
      return { success: true, duration, results };
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      console.log(`❌ Concurrent operations failed after ${duration.toFixed(2)}ms: ${error.message}`);
      return { success: false, duration, error };
    }
  }

  // Run comprehensive test suite
  static async runComprehensiveTest() {
    console.log('🚀 Starting Comprehensive Prismic Test Suite...\n');
    console.log('=' .repeat(50));
    
    const results = {
      individual: {},
      cache: null,
      errors: null,
      concurrent: null,
      summary: null
    };

    try {
      // Individual operation tests
      console.log('1. Individual Operation Tests');
      console.log('-'.repeat(30));
      results.individual = {
        getPages: await this.testGetPages(),
        getAllContent: await this.testGetAllContent(),
        getCategories: await this.testGetCategories(),
        getStaticPages: await this.testGetStaticPages(),
        getBlogPosts: await this.testGetBlogPosts(),
        searchContent: await this.testSearchContent()
      };

      // Cache performance tests
      console.log('\n2. Cache Performance Tests');
      console.log('-'.repeat(30));
      results.cache = await this.testCachePerformance();

      // Error handling tests
      console.log('\n3. Error Handling Tests');
      console.log('-'.repeat(30));
      await this.testErrorHandling();

      // Concurrent operations tests
      console.log('\n4. Concurrent Operations Tests');
      console.log('-'.repeat(30));
      results.concurrent = await this.testConcurrentOperations();

      // Final summary
      console.log('\n📊 Test Suite Summary');
      console.log('=' .repeat(50));
      
      const individualResults = Object.values(results.individual);
      const successfulTests = individualResults.filter(r => r.success_rate > 0).length;
      const totalTests = individualResults.length;
      
      console.log(`Individual Tests: ${successfulTests}/${totalTests} successful`);
      console.log(`Cache Performance: ${results.cache ? 'Tested' : 'Failed'}`);
      console.log(`Concurrent Operations: ${results.concurrent?.success ? 'Passed' : 'Failed'}`);
      
      results.summary = {
        total_tests: totalTests,
        successful_tests: successfulTests,
        cache_tested: !!results.cache,
        concurrent_passed: results.concurrent?.success || false
      };

      console.log('\n✅ Comprehensive test suite completed!');
      
    } catch (error) {
      console.error('\n❌ Test suite failed:', error);
      results.summary = { error: error.message };
    }

    return results;
  }

  // Quick health check
  static async quickHealthCheck() {
    console.log('🏥 Quick Health Check...\n');
    
    const checks = [
      { name: 'Get Pages', test: () => prismicApiService.getPages(1, 1) },
      { name: 'Get Categories', test: () => prismicApiService.getCategories() },
      { name: 'Get Static Pages', test: () => prismicApiService.getStaticPages() }
    ];

    const results = [];
    
    for (const check of checks) {
      try {
        const start = performance.now();
        await check.test();
        const end = performance.now();
        const duration = end - start;
        
        console.log(`✅ ${check.name}: ${duration.toFixed(2)}ms`);
        results.push({ name: check.name, success: true, duration });
      } catch (error) {
        console.log(`❌ ${check.name}: ${error.message}`);
        results.push({ name: check.name, success: false, error: error.message });
      }
    }

    const successful = results.filter(r => r.success).length;
    console.log(`\n📊 Health Check: ${successful}/${results.length} passed`);

    return { results, successful, total: results.length };
  }
}
