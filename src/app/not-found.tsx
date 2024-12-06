import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-8 text-center text-white bg-black">
        <h1 className="mb-4 text-4xl font-bold tracking-tighter text-primary md:text-6xl text-white">
          404 - Page Not Found
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Oops! The page you&#39;re looking for doesn&#39;t exist.
        </p>
        <Button asChild size="lg" className='text-black'>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[white] text-black bg-primary px-8 text-sm font-medium "
          >
            Go Back Home
          </Link>
        </Button>
      </main>
    </div>
  );
};

export default NotFound;
