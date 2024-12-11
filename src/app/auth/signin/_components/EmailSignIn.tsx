"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-2  ">
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        required
        value={formData.email}
        onChange={handleInputChange}
        style={{borderRadius: '0.6rem'}}
        className="rounded-lg border border-[#323232] bg-black placeholder:text-[#8F8F8F] px-4  py-5 text-base w-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />

      {/* Password Input */}
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Enter your password"
        required
        value={formData.password}
        onChange={handleInputChange}
        style={{borderRadius: '0.6rem'}}
        className="rounded-lg border border-[#323232] bg-black placeholder:text-[#8F8F8F] px-4 py-5 text-base w-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        className="flex items-center font-semibold justify-center border border-[#323232] bg-white text-black hover:bg-black hover:text-white transition-all  rounded-md h-[2.5rem]"
          disabled={loading}
          style={{borderRadius: '0.6rem'}}
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>
      <Toaster />
    </form>
  );
};

export default EmailSignIn;
