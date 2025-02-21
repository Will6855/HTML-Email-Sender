// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { 
      username, 
      password, 
      email 
    } = await request.json();

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' }, 
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.generalAccount.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Username already exists' }, 
        { status: 409 }
      );
    }

    // Optional: Check if email is already in use if provided
    if (email) {
      const existingEmail = await prisma.generalAccount.findUnique({
        where: { email }
      });

      if (existingEmail) {
        return NextResponse.json(
          { message: 'Email is already in use' }, 
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.generalAccount.create({
      data: {
        username,
        password: hashedPassword,
        email: email,
        role: 'DEMO' // Default role
      }
    });

    // Successful registration
    return NextResponse.json({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}