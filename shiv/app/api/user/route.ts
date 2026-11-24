// import { NextResponse } from 'next/server';

// let user = {
//   id: '1',
//   fullName: '',
//   role: '',
//   organization: '',
//   profileImage: '',
//   onboarded: false,
// };

// export async function GET() {
//   // Return the current user (placeholder)
//   return NextResponse.json(user);
// }

// export async function POST(request: Request) {
//   // Create a new user (placeholder)
//   const data = await request.json();
//   user = { ...user, ...data, id: '1' };
//   return NextResponse.json(user);
// }

// export async function PUT(request: Request) {
//   // Update the user (placeholder)
//   const data = await request.json();
//   user = { ...user, ...data };
//   return NextResponse.json(user);
// } 

// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET() {
//   // Get the first user (or you can use session/email to get the current user)
//   const user = await prisma.user.findFirst();
//   return NextResponse.json(user || {});
// }

// export async function POST(request: Request) {
//   const data = await request.json();
//   // You may want to add validation here
//   const user = await prisma.user.create({
//     data: {
//       fullName: data.fullName,
//       email: data.email,
//       password: data.password,
//       role: data.role,
//       organization: data.organization,
//       onboarded: data.onboarded ?? false,
//     },
//   });
//   return NextResponse.json(user);
// }


import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();

  // Fallbacks for required fields
  const email = data.email || `user${Date.now()}@example.com`;
  const password = data.password || 'changeme';

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email,
      password,
      role: data.role,
      organization: data.organization,
      onboarded: data.onboarded ?? false,
    },
  });
  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const email = data.email || `user${Date.now()}@example.com`;
  const password = data.password || 'changeme';
  // You may want to add validation here
  const user = await prisma.user.update({
    where: { id: data.id },
    data: {
      fullName: data.fullName,
      email: email,
      password: password,
      role: data.role,
      organization: data.organization,
      onboarded: data.onboarded,
    },
  });
  return NextResponse.json(user);
}