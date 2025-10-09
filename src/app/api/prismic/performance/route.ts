import { NextRequest, NextResponse } from 'next/server';
import { PrismicPerformanceMonitor } from '@/lib/performance/prismic-performance';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const operation = searchParams.get('operation');
    const format = searchParams.get('format') || 'json';

    const metrics = PrismicPerformanceMonitor.getMetrics();
    const summary = PrismicPerformanceMonitor.getSummary();

    // Filter by operation if specified
    const filteredMetrics = operation 
      ? metrics.filter(m => m.operation === operation)
      : metrics;

    if (format === 'summary') {
      return NextResponse.json({
        success: true,
        data: summary
      });
    }

    if (format === 'csv') {
      const csv = [
        'operation,duration,success,cache_hit,timestamp',
        ...filteredMetrics.map(m => 
          `${m.operation},${m.duration},${m.success},${m.cache_hit || false},${m.timestamp}`
        )
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="prismic-performance.csv"'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        metrics: filteredMetrics,
        summary,
        total_metrics: metrics.length,
        filtered_metrics: filteredMetrics.length
      }
    });

  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    PrismicPerformanceMonitor.clearMetrics();
    
    return NextResponse.json({
      success: true,
      message: 'Performance metrics cleared'
    });
  } catch (error) {
    console.error('Error clearing performance metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear performance metrics' },
      { status: 500 }
    );
  }
}
