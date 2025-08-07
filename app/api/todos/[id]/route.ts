import { NextRequest, NextResponse } from 'next/server';
import { todoService } from '../../../lib/todo.service';

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

// PUT /api/todos/[id] - Update a todo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureServiceInitialized();

    const { id } = params;
    const body = await request.json();
    const { text, completed } = body;

    // Validate that at least one field is being updated
    if (text === undefined && completed === undefined) {
      return NextResponse.json(
        { error: 'Either text or completed status must be provided' },
        { status: 400 }
      );
    }

    let updatedTodo;

    // Handle text update
    if (text !== undefined) {
      if (typeof text !== 'string' || !text.trim()) {
        return NextResponse.json(
          { error: 'Text must be a non-empty string' },
          { status: 400 }
        );
      }
      updatedTodo = await todoService.updateTodoText(id, text);
    }

    // Handle completion toggle
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return NextResponse.json(
          { error: 'Completed must be a boolean' },
          { status: 400 }
        );
      }
      // For completion toggle, we need to get current state and update accordingly
      const todos = await todoService.getAllTodos();
      const currentTodo = todos.find(todo => todo.id === id);

      if (!currentTodo) {
        return NextResponse.json(
          { error: 'Todo not found' },
          { status: 404 }
        );
      }

      // Only toggle if the completed state is different
      if (currentTodo.completed !== completed) {
        updatedTodo = await todoService.toggleTodo(id);
      } else {
        updatedTodo = currentTodo;
      }
    }

    if (!updatedTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ todo: updatedTodo }, { status: 200 });
  } catch (error) {
    console.error(`PUT /api/todos/${params?.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureServiceInitialized();

    const { id } = params;
    const deleted = await todoService.deleteTodo(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`DELETE /api/todos/${params?.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}

// PATCH /api/todos/[id] - Toggle todo completion
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureServiceInitialized();

    const { id } = params;
    const updatedTodo = await todoService.toggleTodo(id);

    if (!updatedTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ todo: updatedTodo }, { status: 200 });
  } catch (error) {
    console.error(`PATCH /api/todos/${params?.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to toggle todo' },
      { status: 500 }
    );
  }
}
