import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env. ENCRYPTION_KEY;

function encryptPassword(password: string): string {
  try {
    const key = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(password, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    return `${iv.toString('base64')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt password');
  }
}

export function decryptPassword(encryptedPassword: string): string {
  try {
    if (!encryptedPassword || !encryptedPassword.includes(':')) {
      console.error('Invalid encrypted password format:', encryptedPassword);
      throw new Error('Invalid encrypted password format');
    }

    const key = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest();
    const [ivBase64, encryptedData] = encryptedPassword.split(':');

    if (!ivBase64 || !encryptedData) {
      console.error('Malformed encrypted password:', encryptedPassword);
      throw new Error('Malformed encrypted password');
    }

    const iv = Buffer.from(ivBase64, 'base64');

    if (iv.length !== 16) {
      console.error('Invalid IV length:', iv.length);
      throw new Error('Invalid initialization vector');
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      encryptedPassword
    });
    throw new Error('Failed to decrypt password');
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const userAccounts = await prisma.emailAccount.findMany({
      where: { generalAccountId: userId }
    });

    userAccounts.forEach(account => {
      account.password = decryptPassword(account.password);
    });

    return NextResponse.json(userAccounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { email, password, name, smtpServer, smtpPort } = await request.json();

    // Validate input
    if (!email || !password || !name || !smtpServer || !smtpPort) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAccount = await prisma.emailAccount.create({
      data: {
        email,
        password: encryptPassword(password),
        name,
        smtpServer,
        smtpPort,
        generalAccountId: userId
      }
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error('Error adding account:', error);
    return NextResponse.json({ error: 'Failed to add account' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { id, email, password, name, smtpServer, smtpPort } = await request.json();

    // Validate input
    if (!id || !email || !name || !smtpServer || !smtpPort) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedAccount = await prisma.emailAccount.update({
      where: { 
        id: id,
        generalAccountId: userId 
      },
      data: {
        email,
        name,
        smtpServer,
        smtpPort,
        // Only update password if a new one is provided
        ...(password && { password: encryptPassword(password) }),
      }
    });

    return NextResponse.json(updatedAccount, { status: 200 });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('id');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    await prisma.emailAccount.delete({
      where: { 
        id: accountId,
        generalAccountId: session.user.id 
      }
    });

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}