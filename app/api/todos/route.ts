import { NextRequest, NextResponse } from 'next/server';
import { todoService } from '../../lib/todo.service';

// Initialize the service when the module loads
let serviceInitialized = false;

async function ensureServiceInitialized() {
  if (!serviceInitialized) {
    try {
      await todoService.initialize();
      serviceInitialized = true;
    } catch (error) {
      console.error('Failed to initialize todo service:', error);
      throw error;
    }
  }
}

// GET /api/todos - Get all todos
export async function GET() {
  try {
    await ensureServiceInitialized();
    const todos = await todoService.getAllTodos();
    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    console.error('GET /api/todos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    await ensureServiceInitialized();

    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Todo text is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const newTodo = await todoService.addTodo(text);
    return NextResponse.json({ todo: newTodo }, { status: 201 });
  } catch (error) {
    console.error('POST /api/todos error:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos - Clear completed todos
export async function DELETE() {
  try {
    await ensureServiceInitialized();
    const deletedCount = await todoService.clearCompleted();
    return NextResponse.json({ deletedCount }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/todos error:', error);
    return NextResponse.json(
      { error: 'Failed to clear completed todos' },
      { status: 500 }
    );
  }
}
