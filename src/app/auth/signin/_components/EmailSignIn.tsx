"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { toast, Toaster } from "sonner";

const EmailSignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router=useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        isSignUp: false,
      });

      if (result?.error) {
        toast.error(result.error, { position: "bottom-right" });
    } else {
        toast.success("Successfully signed in!", { position: "bottom-right" });
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[#8F8F8F]">
        {/* Email Input */}
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          value={formData.email}
          style={{borderRadius: '0.6rem'}}
          onChange={handleInputChange}
          className="rounded-lg border border-[#323232] bg-black placeholder:text-[#8F8F8F] px-4 py-5 text-base w-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />

        {/* Password Input */}
        <Input
          id="password"
          name="password"
          style={{borderRadius: '0.6rem'}}
          type="password"
          placeholder="Enter your password"
          required
          value={formData.password}
          onChange={handleInputChange}
          className="rounded-lg border border-[#323232] bg-black placeholder:text-[#8F8F8F] px-4 py-5 text-base w-full "
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="flex items-center font-semibold justify-center border border-[#323232] bg-white text-black hover:bg-black hover:text-white transition-all  rounded-md h-[2.5rem]"
          disabled={loading}
          style={{borderRadius:"0.6rem"}}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
        <p className="mt-2 text-center text-sm text-[#8F8F8F]">
          Don't have an account?{" "} <Link href="/auth/signup" className="underline"> SignUp</Link> here
          </p>
        <p className=" text-center text-sm text-[#8F8F8F]">
          Admin Signin?{" "} <Link href="/admin/login" className="underline"> SignIn</Link> here
          </p>

        <p className="mt-4 text-center text-sm text-[#8F8F8F]">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline hover:text-primary">Terms of Service</a> and{" "}
          <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
        </p>

        <Toaster />
      </form>
  );
};

export default EmailSignIn;
