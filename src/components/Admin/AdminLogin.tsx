'use client';
import React from 'react';
import { TopLeftShine } from '../ui/Shine';
import AdminLoginButtons from './AdminLoginButtons';
import Image from 'next/image';

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen bg-black md:grid md:grid-cols-5 md:px-0 overflow-hidden">
      <div className="md:col-span-2 flex flex-col justify-center p-6 md:p-12 mx-auto bg-black  ">
        <div className="absolute top-0 left-0 flex justify-start w-screen overflow-hidden pointer-events-none">
          <TopLeftShine />
        </div>

        <div className="flex flex-col items-center text-start space-y-2 m-2">
          <h1 className="text-2xl font-semibold text-[#807F7F] dark:text-white">
            Sign To Admin Dashboard
          </h1>
          <p className="text-sm text-[#8F8F8F]">
            Enter your email and password to Sign In
          </p>
        </div>

        <div className="space-y-6 bg-black">
          <div className="space-y-4">
            <AdminLoginButtons />
          </div>
        </div>
      </div>

      {/* Right Side - Background Image and Quote (60% width) */}
      <div className="relative hidden md:inline h-full bg-muted text-white lg:flex flex-col p-10 md:col-span-3 border-l border-[#323232]">
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="mr-2 h-6 w-6" />
          Elytra Inc
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Our AI-powered video chatbot is revolutionizing student counseling by providing instant, personalized support. With real-time responses, we empower students to make informed decisions about their academic and career paths.&rdquo;
            </p>
            <footer className="text-sm">Admin Dashboard - Powered by AI</footer>
          </blockquote>
        </div>


        <div className="absolute bottom-40 left-52 w-full h-1/2 overflow-hidden z-10 shadow-lg">
          <Image
            src="/admindashboard.jpg"
            alt="Admin Dashboard"
            layout="fill"
            objectFit="cover" // Ensures the image scales and crops correctly
            className="opacity-80"
          />
        </div>
      </div>
    </div>
  );
}
