import React from 'react';
import { ArrowRight, BookOpen, Globe, Users } from 'lucide-react';
import Navbar from '../Navbar';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#151723] text-white overflow-hidden">
            <Navbar />

                    <div className="relative flex items-center justify-center min-h-screen">
                    <Gradient/>


                <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:100px_100%] opacity-30 z-0"></div>

                <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl  tracking-tight bg-clip-text text-transparent bg-gradient-to-r text-white">
                        Unlock Your Full Potential with AI-Powered Student Counseling
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl lg:text-xl text-[#9FA5C6] leading-relaxed sm:leading-snug lg:leading-normal max-w-4xl mx-auto">
                        Experience the future of education, where personalized AI interactions guide you to success in your international academic journey.
                    </p>
                    <div className="mt-8 space-x-4 flex justify-center">
                        <Link href="/auth/signin" className="px-6 py-2 sm:px-8 sm:py-4 bg-[#4220A9] text-white rounded-lg hover:bg-[#321880] transition-colors duration-200 flex items-center">
                            Get Started <ArrowRight className="ml-2" size={20} />
                        </Link>
                        <button className="px-6 py-2 sm:px-8 sm:py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 ml-4">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-[#151723]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-[#9FA5C6]">Explore the Power of AI for Your Education</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Globe size={40} />}
                            title="Global Opportunities"
                            description="Explore study options in top universities worldwide and open doors to global learning."
                        />
                        <FeatureCard
                            icon={<BookOpen size={40} />}
                            title="Tailored Learning Paths"
                            description="Receive personalized advice and academic plans that match your unique goals."
                        />
                        <FeatureCard
                            icon={<Users size={40} />}
                            title="Join a Thriving Community"
                            description="Be part of a global network of students, educators, and professionals dedicated to your success."
                        />
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-16 bg-[#151723]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4 text-white">Take the First Step Towards Your Future</h2>
                    <p className="text-xl text-[#9FA5C6] mb-8">Thousands of students are already experiencing personalized AI guidance. Why wait?</p>
                    <button className="px-6 py-3 bg-[#4220A9] text-white rounded-lg hover:bg-[#321880] transition-colors duration-200">
                        Sign Up Now and Start Your Journey
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#1C1E2D] py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-gray-400">
                        © 2023 Elytra. Empowering students with AI-driven guidance for global education.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-[#232534] p-6 rounded-lg text-center hover:bg-[#3A3D47] transition-colors duration-200">
            <div className="text-[#4220A9] mb-4 flex justify-center">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
            <p className="text-[#9FA5C6]">{description}</p>
        </div>
    );
}


function Gradient(){
    return (
        <>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] 
            rounded-full bg-gradient-to-tr from-[#3B1FAB] via-[#3B1FAB] to-[#3B1FAB] 
            blur-[150px] sm:blur-[150px] lg:blur-[150px] opacity-40 z-0"></div>

        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] 
            rounded-full bg-gradient-to-tr from-[#3B1FAB] via-[#3B1FAB] to-[#3B1FAB] 
            blur-[150px] sm:blur-[150px] lg:blur-[150px] opacity-40 z-0"></div>

        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] 
            rounded-full bg-gradient-to-tr from-[#3B1FAB] via-[#3B1FAB] to-[#3B1FAB] 
            blur-[150px] sm:blur-[150px] lg:blur-[150px] opacity-40 z-0"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] 
            rounded-full bg-gradient-to-tr from-[#3B1FAB] via-[#3B1FAB] to-[#3B1FAB] 
            blur-[150px] sm:blur-[150px] lg:blur-[150px] opacity-40 z-0"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] 
            rounded-full bg-gradient-to-tr from-[#3B1FAB] via-[#3B1FAB] to-[#3B1FAB] 
            blur-[150px] sm:blur-[150px] lg:blur-[150px] opacity-40 z-0"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] 
            rounded-full bg-gradient-to-tr from-[#3B1FAB] via-[#3B1FAB] to-[#3B1FAB] 
            blur-[150px] sm:blur-[150px] lg:blur-[150px] opacity-40 z-0"></div>
    </>
    )
}