"use client";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";

const EmailSignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        required
        value={formData.email}
        onChange={handleInputChange}
        className="w-full px-4 py-3 text-white bg-[#1c1e2d] border border-gray-700 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-[#4220A9] focus:outline-none"
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
        className="w-full px-4 py-3 text-white bg-[#1c1e2d] border border-gray-700 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-[#4220A9] focus:outline-none"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 font-semibold text-white transition-all transform bg-gradient-to-r from-[#4220A9] to-[#321880] rounded-lg hover:opacity-90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
      <Toaster />
    </form>
  );
};

export default EmailSignIn;
