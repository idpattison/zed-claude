import { NextResponse } from 'next/server';
import { todoService } from '../../lib/todo.service';

export async function GET() {
  try {
    // Initialize service if not already done
    await todoService.initialize();

    // Check if the service is healthy
    const isHealthy = await todoService.isHealthy();

    if (isHealthy) {
      return NextResponse.json(
        {
          status: 'healthy',
          database: 'connected',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: 'unhealthy',
          database: 'disconnected',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
