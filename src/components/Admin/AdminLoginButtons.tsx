'use client'
import { loginAdmin } from '@/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast, Toaster } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';

const AdminLoginButtons = () => {
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[#8F8F8F] font-sans">
        {/* Name Input */}
        <Input
          id="name"
          name="Email"
          type="text"
          placeholder="Enter your email"
          required
          value={email}
          style={{borderRadius: '0.6rem'}}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-[#323232] bg-black placeholder:text-[#8F8F8F]  px-4 py-5 text-base w-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />

        {/* Email Input */}
        <Input
          id="password"
          name="Password"
          type="Password"
          placeholder="Enter your password"
          required
          value={password}
          style={{borderRadius: '0.6rem'}}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-[#323232] bg-black placeholder:text-[#888888] px-4 py-5 text-base w-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />

        <Button
          type="submit"
          className="flex items-center font-semibold justify-center border border-[#323232] bg-white text-black hover:bg-black hover:text-white transition-all  rounded-md h-[2.7rem]"
          disabled={loading}
          style={{borderRadius:"0.6rem"}}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>

        <p className="mt-2 text-center text-sm text-[#8F8F8F]">
          Already have an Account?{" "} <Link href="/auth/signin" className="underline"> SignIn</Link> here
          </p>

        <p className="mt-4 text-center text-sm text-[#8F8F8F]">
          By clicking continue, you agree to our{" "}
          <a href="/terms" className="underline hover:text-primary">Terms of Service</a> and{" "}
          <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>.
        </p>

        <Toaster />
      </form>
  )
}

export default AdminLoginButtons
