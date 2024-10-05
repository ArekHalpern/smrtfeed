import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const papers = await prisma.paper.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json(papers);
  } catch (error) {
    console.error('Error fetching papers:', error);
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}