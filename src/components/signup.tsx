import React from 'react';
import { Input } from './ui/input';
import { GithubIcon, GoogleIcon } from '@/icons/icons';
import SignupButtons from './SignUpButtons';

export default function SignupPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#151723] px-4">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#4220A9] via-[#4220A9]/80 to-[#321880] blur-3xl opacity-10 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:70px_70%] opacity-35 z-0"></div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Signup.</h1>
          <p className="text-gray-400">Create an account with us.</p>
        </div>

        <div className="space-y-4">
        <SignupButtons/>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Input
            type="email"
            placeholder="email@example.com"
            className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4220A9] focus:border-transparent"
          />

          <Input
            type="password"
            placeholder="Your password"
            className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4220A9] focus:border-transparent"
          />

          <button className="w-full py-3 px-4 bg-[#4220A9] text-white rounded-lg hover:bg-[#321880] transition-colors">
            Sign up
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-400">Already member? </span>
            <a href="#" className="text-[#4220A9] hover:text-[#321880]">
              Log in now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

