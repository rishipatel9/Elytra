import EmailSignIn from "@/app/auth/signin/_components/EmailSignIn";
import Link from "next/link";


export default async function SignIn() {


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 font-sans bg-gradient-to-br from-[#1e1e2f] to-[#151723] overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[500px] rounded-full bg-gradient-to-r from-[#4220A9] to-[#391a94] blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#4220A9]/60 to-[#321880]/60 blur-2xl opacity-20"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:80px_80px] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md p-6 space-y-8 bg-[#1a1b25] border border-gray-800 rounded-lg shadow-lg">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-wide text-white">Sign In</h1>
        </div>

        <EmailSignIn />

        <div className="text-center text-sm">
          <span className="text-gray-400">Don’t have an account? </span>
          <Link
            href="/auth/signup"
            className="font-medium transition-colors text-[#4220A9] hover:text-[#321880]"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
