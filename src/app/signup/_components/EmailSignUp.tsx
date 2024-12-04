'use client';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';

const EmailSignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
                name,
            });
    
            setLoading(false);
    
            if (result?.error) {
                setError(result.error); // This is where we handle error from NextAuth
                console.log('Error during sign in:', result.error);
                toast.error(result.error); // Toast error message
            } else {
                toast.success('Successfully signed up!', {
                    position: 'bottom-right',
                });
                // Optional: redirect or perform other actions after success
            }
        } catch (err) {
            setLoading(false);
            setError('An unexpected error occurred');
            toast.error('An unexpected error occurred', {
                position: 'top-center',
            });
        }
    };
    

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
                <div>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        required
                        className="w-full px-4 py-3 bg-[#1c1e2d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4220A9] focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-3 bg-[#1c1e2d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4220A9] focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        className="w-full px-4 py-3 bg-[#1c1e2d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4220A9] focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#4220A9] to-[#321880] text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <Toaster/>
            </form>
            
        </>
    );
};

export default EmailSignUp;

