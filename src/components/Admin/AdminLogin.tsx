'use client';
import React, { useState } from 'react';
import { Input } from '../ui/input'; 
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/utils';
import { toast, Toaster } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent):Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginAdmin({ email, password });
      console.log('Login successful:', data);
      router.push('/admin/dashboard');  
      toast.success('Login successful');
    } catch (error) {
      console.error('Failed to log in:', error);
      setError('Failed to log in.');
      toast.error('Failed to log in.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#151723] px-4">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#4220A9] via-[#4220A9]/80 to-[#321880] blur-3xl opacity-10 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:70px_70%] opacity-35 z-0"></div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Admin.</h1>
          <p className="text-gray-400">Login to Admin Dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="email@example.com"
            value={email}
            autoComplete='email'
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4220A9] focus:border-transparent"
          />
          <Input
            type="password"
            placeholder="Your password"
            value={password}
            autoComplete='current-password'
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4220A9] focus:border-transparent"
          />

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#4220A9] text-white rounded-lg hover:bg-[#321880] transition-colors"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          <Toaster />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}