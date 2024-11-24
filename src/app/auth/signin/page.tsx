'use client';

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#151723] px-4">

        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#4220A9] via-[#4220A9]/80 to-[#321880] blur-3xl opacity-10 z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:70px_70%] opacity-35 z-0"></div>
  
        <div className="relative z-10 w-full max-w-md space-y-8">
  
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Signin.</h1>
            <p className="text-gray-400">Signin to your Account</p>
          </div>
  
            <button 
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full py-3 px-4 bg-[#4220A9] text-white rounded-lg hover:bg-[#321880] transition-colors">
              Sign up
            </button>
          </div>
        </div>
    );
}