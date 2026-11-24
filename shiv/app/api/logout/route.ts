import { NextResponse } from 'next/server';

export async function POST() {
  // Remove any cookies or session here if you use them
  // For now, just return a success response
  return NextResponse.json({ message: 'Logged out' }, { status: 200 });
}