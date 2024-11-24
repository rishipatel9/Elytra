'use client'
import { signIn } from 'next-auth/react'
import React from 'react'

const SigninButton = () => {
    return (

        <button
            type="button"
            onClick={() => signIn('google',)}
            className="w-full py-3 px-4 bg-[#4220A9] text-white rounded-lg hover:bg-[#321880] transition-colors">
            Sign in
        </button>
    )
}

export default SigninButton
