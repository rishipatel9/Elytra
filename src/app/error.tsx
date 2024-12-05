'use client'
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ErrorPage = ({ statusCode = 500, message = "Something Went Wrong!!" }: { statusCode?: number, message?: string }) => {


  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-8 text-center text-white bg-black">
        <h1 className="mb-4 text-4xl font-bold tracking-tighter text-primary md:text-6xl text-white">
          {statusCode} - {message}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Oops! The page you're looking for doesn't exist or there was an error processing your request.
        </p>
        <Button asChild size="lg" className='text-black hover:bg-white'>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md text-black bg-[white]  bg-primary px-8 text-sm"
          >
            Go Back Home
          </Link>
        </Button>
      </main>
    </div>
  );
};

export default ErrorPage;
