#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'node:readline/promises';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdminUser() {
  try {
    console.log('Create Admin User');
    
    // Prompt for username
    const username = await rl.question('Enter username: ');

    // Prompt for email
    const email = await rl.question('Enter email: ');

    // Prompt for password
    const password = await rl.question('Enter password: ');

    // Close readline interface
    rl.close();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = await prisma.generalAccount.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log(`Admin user created successfully:`);
    console.log(`- Username: ${adminUser.username}`);
    console.log(`- Email: ${adminUser.email}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      console.error('Username or email already exists.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser().catch(console.error);