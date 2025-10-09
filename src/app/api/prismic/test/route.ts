import { NextRequest, NextResponse } from 'next/server';
import { PrismicTestUtils } from '@/lib/testing/prismic-test-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('type') || 'health';
    const format = searchParams.get('format') || 'json';

    let results;

    switch (testType) {
      case 'health':
        results = await PrismicTestUtils.quickHealthCheck();
        break;
      
      case 'comprehensive':
        results = await PrismicTestUtils.runComprehensiveTest();
        break;
      
      case 'cache':
        results = await PrismicTestUtils.testCachePerformance();
        break;
      
      case 'concurrent':
        results = await PrismicTestUtils.testConcurrentOperations();
        break;
      
      case 'individual':
        const individualResults = await Promise.all([
          PrismicTestUtils.testGetPages(),
          PrismicTestUtils.testGetCategories(),
          PrismicTestUtils.testGetStaticPages(),
          PrismicTestUtils.testGetBlogPosts()
        ]);
        results = { tests: individualResults };
        break;
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid test type. Use: health, comprehensive, cache, concurrent, or individual' },
          { status: 400 }
        );
    }

    if (format === 'text') {
      return new NextResponse(JSON.stringify(results, null, 2), {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    return NextResponse.json({
      success: true,
      test_type: testType,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('Error running Prismic tests:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test execution failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType = 'health', runAsync = false } = body;

    if (runAsync) {
      // Run test in background and return immediately
      PrismicTestUtils.runComprehensiveTest().catch(console.error);
      
      return NextResponse.json({
        success: true,
        message: 'Test started in background',
        test_type: testType
      });
    }

    // Run test synchronously
    const results = await PrismicTestUtils.runComprehensiveTest();
    
    return NextResponse.json({
      success: true,
      test_type: testType,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('Error running Prismic tests:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test execution failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
