import { NextRequest, NextResponse } from 'next/server';
import { updateMCQ, deleteMCQ, getMCQs } from '@/lib/googleSheets';
import { mcqPayloadSchema } from '@/lib/mcq';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mcqs = await getMCQs();
    const mcq = mcqs.find((m) => m.id === id);
    
    if (!mcq) {
      return NextResponse.json({ error: 'MCQ not found' }, { status: 404 });
    }
    
    return NextResponse.json(mcq);
  } catch (error) {
    console.error('Error fetching MCQ:', error);
    return NextResponse.json({ error: 'Failed to fetch MCQ' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const parsed = mcqPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await updateMCQ(id, parsed.data);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating MCQ:', error);
    if (error instanceof Error && error.message === 'MCQ not found') {
      return NextResponse.json({ error: 'MCQ not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update MCQ' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMCQ(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting MCQ:', error);
    if (error instanceof Error && error.message === 'MCQ not found') {
      return NextResponse.json({ error: 'MCQ not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete MCQ' }, { status: 500 });
  }
}
