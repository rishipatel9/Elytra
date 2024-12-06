import React from 'react';
import { Input } from '../ui/input';
import SignupButtons from '../SignUpButtons';
import EmailSignUp from '@/app/auth/signup/_components/EmailSignUp';
import Link from 'next/link';


export default function SignUp() {
  return (
    <div className="relative flex flex-col items-center font-sans justify-center min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#151723] px-4 overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[500px] rounded-full bg-gradient-to-r from-[#4220A9] to-[#391a94] blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#4220A9]/60 to-[#321880]/60 blur-2xl opacity-20"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:80px_80px] opacity-10 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-6 bg-[#1a1b25] rounded-lg shadow-lg space-y-8 border border-gray-800">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-wide">Sign up</h1>
          <p className="text-gray-400 mt-2">Join us and explore endless possibilities.</p>
        </div>

        {/* Social Signup Buttons */}
        <div className="space-y-4">
          <SignupButtons />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#1a1b25] text-gray-500">Or sign up with</span>
            </div>
          </div>

          <EmailSignUp/>

        

          {/* Additional Links */}
          <div className="text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Link
              href="/auth/signin"
              className="text-[#4220A9] font-medium hover:text-[#321880] transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-400">Admin? </span>
            <a
              href="/admin/login"
              className="text-[#4220A9] font-medium hover:text-[#321880] underline transition-colors"
            >
              Login as Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
