'use client'
import React from 'react'
import { signIn } from "next-auth/react";

const SignupButtons = () => {
    return (
        <>
            <div className="flex flex-col gap-4">
                <button type='button' 
                    onClick={() => signIn("google")}
                    className="relative group/btn flex space-x-2 items-center justify-center border  border-[#2D2D2D] px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                >
                    <span className="text-neutral-300 text-sm font-bold">
                        Google
                    </span>
                </button>
                <button type='button' 
                    onClick={() => signIn("github")}
                    className="relative group/btn flex space-x-2 items-center border border-[#2D2D2D] justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                >
                    <span className="text-neutral-300 text-sm font-bold">
                        GitHub
                    </span>
                </button>
            </div>
        </>
    );
}

export default SignupButtons