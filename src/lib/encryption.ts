import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export function encryptPassword(password: string): string {
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