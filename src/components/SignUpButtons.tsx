'use client'
import React from 'react'
import { signIn } from "next-auth/react";
import { GithubIcon, GoogleIcon } from '@/icons/icons';

const SignupButtons = () => {
    return (
        <>
            <div className="flex flex-col gap-4">
                <button
                type='button'
                onClick={() => signIn("github")}
                 className="w-full py-2 px-4 flex items-center justify-center gap-2 bg-[#111827] text-white rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors">
                    <GithubIcon />
                    <span>Signup with GitHub</span>
                </button>
                <button 
                 type='button'
                 onClick={() => signIn('google')}
                className="w-full py-2 px-4 flex items-center justify-center gap-2 bg-[#111827] text-white rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors">
                    <GoogleIcon />
                    <span>Signup with Google</span>
                </button>
            </div>
        </>
    );
}

export default SignupButtons