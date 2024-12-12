import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Video, Lock, MessageCircle } from 'lucide-react'
import { TopRightShine } from "../ui/Shine"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
     
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-purple-500" />
          <span className="text-xl font-bold">Elytra</span>
        </div>
        <nav>

        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            AI-Powered Video Chatbot for Student Counseling
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Get instant support and guidance from our AI counselor. Available 24/7, confidential, and tailored to your needs.
          </p>
          <Link href="/auth/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg">
            Start Chatting Now
          </Link>
        </div>
        <div className="md:w-1/2">
          <img 
            src="/admindashboard.jpg" 
            alt="AI Counselor Interface" 
            className="rounded-lg shadow-2xl border-4 border-purple-500"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Video className="h-12 w-12 text-purple-500" />}
              title="Video Chat"
              description="Face-to-face interactions with our AI for a more personal experience."
            />
            <FeatureCard 
              icon={<Brain className="h-12 w-12 text-purple-500" />}
              title="AI-Powered"
              description="Advanced AI technology to provide accurate and helpful responses."
            />
            <FeatureCard 
              icon={<Lock className="h-12 w-12 text-purple-500" />}
              title="Confidential"
              description="Your conversations are private and secure, always."
            />
            <FeatureCard 
              icon={<MessageCircle className="h-12 w-12 text-purple-500" />}
              title="24/7 Support"
              description="Get help anytime, day or night, whenever you need it."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8 text-gray-300">
          Join thousands of students benefiting from AI-powered counseling.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <Input 
            type="email" 
            placeholder="Enter your email" 
            className="md:w-64 bg-gray-800 text-white border-purple-500"
          />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full">
            Sign Up for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 AI Counselor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }:{icon: React.ReactNode, title: string, description: string}) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

