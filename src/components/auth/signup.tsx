

import EmailSignUp from '@/app/auth/signup/_components/EmailSignUp';
import { TopLeftShine, TopRightShine } from "../ui/Shine";
import SignupButtons from "../SignUpButtons";

export default function SignUp() {
  return (
    <div className="flex min-h-screen bg-black md:grid md:grid-cols-5 md:px-0">
    {/* Left Side - SignUp Form (40% width) */}
    <div className="md:col-span-2 flex flex-col justify-center p-6 md:p-12 space-y-6 max-w-[450px] mx-auto bg-black">
      <div className="absolute top-0 left-0 flex justify-start w-screen overflow-hidden pointer-events-none">
        <TopLeftShine />
      </div> 
  
      <div className="flex flex-col items-center text-start space-y-2">
        <h1 className="text-2xl font-semibold text-[#807F7F]">
          Create an account
        </h1>
        <p className="text-sm text-[#8F8F8F]">
          Enter your email below to create your account
        </p>
      </div>
      
      <SignupButtons/>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#8F8F8F]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2  text-[#8F8F8F]">
            Or continue with
          </span>
        </div>
      </div>
  
      {/* Form */}
      <div className="space-y-6 bg-black">
        <div className="space-y-4">
          <EmailSignUp />
        </div>
      </div>
    </div>
  
    {/* Right Side - Background Image and Quote (60% width) */}
    <div className="relative hidden md:inline h-full bg-muted text-white lg:flex flex-col p-10 md:col-span-3">
      <div className="absolute inset-0 bg-zinc-900 opacity-60" />
      <div className="relative z-20 flex items-center text-lg font-medium">
        <div className="mr-2 h-6 w-6" />
        Elytra Inc
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">
            &ldquo;This platform has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.&rdquo;
          </p>
          <footer className="text-sm">Sofia Davis</footer>
        </blockquote>
      </div>
    </div>
  </div>
  
  );
}
