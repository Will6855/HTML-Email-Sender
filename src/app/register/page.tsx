'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

// Registration schema based on Prisma GeneralAccount model
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Successful registration - redirect to login
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2">Username *</label>
            <input 
              {...register('username')}
              type="text" 
              id="username"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="firstName" className="block mb-2">First Name</label>
            <input 
              {...register('firstName')}
              type="text" 
              id="firstName"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block mb-2">Last Name</label>
            <input 
              {...register('lastName')}
              type="text" 
              id="lastName"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your last name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">Email *</label>
            <input 
              {...register('email')}
              type="email" 
              id="email"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2">Password *</label>
            <input 
              {...register('password')}
              type="password" 
              id="password"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account? 
            <a href="/login" className="text-blue-500 ml-1 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}