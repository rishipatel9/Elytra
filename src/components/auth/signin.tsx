import SignupButtons from "../SignUpButtons";
import { TopLeftShine, TopRightShine } from "../ui/Shine";
import EmailSignIn from '@/app/auth/signin/_components/EmailSignIn';

export default function SignIn() {
  return (
    <div className="flex min-h-screen bg-black md:grid md:grid-cols-5 md:px-0">
      {/* Left Side - Sign In Form */}
      <div className="md:col-span-2 flex flex-col justify-center p-6 md:p-12 mx-auto bg-black ">
        <div className="absolute top-0 left-0 flex justify-start w-screen overflow-hidden pointer-events-none">
          <TopLeftShine />
        </div>

        <div className="flex flex-col items-center text-start space-y-2 m-2">
          <h1 className="text-2xl font-semibold text-[#807F7F] dark:text-white">
            Sign In to your account
          </h1>
          <p className="text-sm text-[#8F8F8F]">
            Enter your email and password to Sign In
          </p>
        </div>

        <div className="space-y-6 bg-black">
          <div className="space-y-4">
            <EmailSignIn />
          </div>
        </div>
      </div>

      {/* Right Side - Background Image and Quote (60% width) */}
      <div className="relative hidden md:inline h-full bg-muted text-white lg:flex flex-col p-10 md:col-span-3">
        <div className="absolute inset-0 bg-zinc-900 opacity-60" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="mr-2 h-6 w-6" />
          Elytra Inc
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
