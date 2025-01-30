// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' }, 
        { status: 400 }
      );
    }

    // Find user by username
    const user = await prisma.generalAccount.findUnique({
      where: { username }
    });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: 'Invalid username or password' }, 
        { status: 401 }
      );
    }

    // Successful login
    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}