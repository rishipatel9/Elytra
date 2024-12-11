'use client';

import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { GithubIcon, GoogleIcon } from "@/icons/icons";
// import { GitHubIcon, GoogleIcon } from '@/components/ui/icons'; // Icons component for GitHub & Google

const EmailSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        name,
        isSignUp: true,
      });

      setLoading(false);

      if (result?.error) {
        setError(result.error); 
        console.log('Error during sign in:', result.error);
        toast.error(result.error);
      } else {
        toast.success('Successfully signed up!', {
          position: 'bottom-right',
        });
        router.push('/student/student-info'); // Redirect to student form
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred', {
        position: 'top-center',
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[#8F8F8F]">
        {/* Name Input */}
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          required
          value={name}
          style={{borderRadius: '0.6rem'}}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-[#323232] bg-black placeholder:text-[#8F8F8F] px-4 py-5 text-base w-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />

        {/* Email Input */}
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          style={{borderRadius: '0.6rem'}}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-[#323232] bg-black placeholder:text-[#8F8F8F] px-4 py-5 text-base w-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />

        {/* Password Input */}
        <Input
          id="password"
          name="password"
          style={{borderRadius: '0.6rem'}}
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-[#323232] bg-black placeholder:text-[#8F8F8F] px-4 py-5 text-base w-full "
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="flex items-center font-semibold justify-center border border-[#323232] bg-white text-black hover:bg-black hover:text-white transition-all  rounded-md h-[2.5rem]"
          disabled={loading}
          style={{borderRadius:"0.6rem"}}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>

        <p className="mt-4 text-center text-sm text-[#8F8F8F]">
          By clicking continue, you agree to our{" "}
          <a href="/terms" className="underline hover:text-primary">Terms of Service</a> and{" "}
          <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>.
        </p>

        <Toaster />
      </form>
    </>
  );
};

export default EmailSignUp;
