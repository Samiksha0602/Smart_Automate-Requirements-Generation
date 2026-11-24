import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder: return a sample onboarding response
  return NextResponse.json({ message: 'Onboarding API route' });
}

export async function POST(request: Request) {
  // Placeholder: handle POST request for onboarding
  const data = await request.json();
  return NextResponse.json({ message: 'Onboarding POST received', data });
} 