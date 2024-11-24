// app/dashboard/page.tsx
import Dashboard from '../../components/Dashboard';
import { getUserDetails } from '../../utils';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const session = await getUserDetails();
  
  if (!session) {
    redirect('/');
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <Dashboard />
    </div>
  );
};

export default Page;