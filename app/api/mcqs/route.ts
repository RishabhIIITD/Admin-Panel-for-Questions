import { NextRequest, NextResponse } from 'next/server';
import { getMCQs, addMCQ } from '@/lib/googleSheets';
import { mcqPayloadSchema } from '@/lib/mcq';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const mcqs = await getMCQs();
    return NextResponse.json(mcqs);
  } catch (error: unknown) {
    console.error('Error fetching MCQs:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch MCQs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const newMCQ = {
      ...parsed.data,
      id: uuidv4(),
    };

    await addMCQ(newMCQ);
    return NextResponse.json(newMCQ, { status: 201 });
  } catch (error) {
    console.error('Error creating MCQ:', error);
    return NextResponse.json({ error: 'Failed to create MCQ' }, { status: 500 });
  }
}
