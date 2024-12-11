'use client'
import React from 'react'
import { GitHub, Google,  } from '@/icons/icons';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';

const SignupButtons = () => {
    return (
        <>
            <Button variant="default" type="button"  onClick={() => signIn("github")} className="w-full bg-[#232121] py-5 border border-[#323232]  hover:bg-white hover:text-black transition-all " style={{ borderRadius: "0.6rem" }} >
                <GitHub className="h-10 w-10 size-10" />
                GitHub
            </Button>
            <Button variant="default" type="button"  onClick={() => signIn("google")} className="w-full bg-[#232121] py-5 border border-[#323232]  hover:bg-white hover:text-black transition-all " style={{ borderRadius: "0.6rem" }}>
                <Google className="h-10 w-10" />
                Google
            </Button>
        </>
    );
}

export default SignupButtons