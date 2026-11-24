import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder: return a sample history response
  return NextResponse.json({ message: 'History API route' });
}

export async function POST(request: Request) {
  // Placeholder: handle POST request for history
  const data = await request.json();
  return NextResponse.json({ message: 'History POST received', data });
} 