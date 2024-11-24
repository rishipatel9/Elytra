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

    // Show loading state while checking session
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-bold">
                        Sign in to your account
                    </h2>
                </div>
                <button
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}