"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageProvider } from '@/context/LanguageContext';

export default function Login() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loginSchema = z.object({
    username: z.string().min(1, t('usernameRequired')),
    password: z.string().min(1, t('passwordRequired'))
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password
      });

      if (result?.error) {
        setError(t('invalidUsernameOrPassword'));
        return;
      }

      // Redirect to send-mail page on successful login
      router.push("/send-mail");
    } catch (err) {
      setError(t('unexpectedError'));
    }
  };

  return (
    <LanguageProvider>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{t('loginTitle')}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2">{t('username')}</label>
            <input 
              {...register('username')}
              type="text" 
              id="username"
              className="w-full px-3 py-2 border rounded-md"
              placeholder={t('usernamePlaceholder')}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2">{t('password')}</label>
            <input 
              {...register('password')}
              type="password" 
              id="password"
              className="w-full px-3 py-2 border rounded-md"
              placeholder={t('passwordPlaceholder')}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            {t('signIn')}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {t('noAccount')}
            <a href="/register" className="text-blue-500 ml-1 hover:underline">
              {t('signUp')}
            </a>
          </p>
        </div>
      </div>
    </div>
    </LanguageProvider>
  );
}