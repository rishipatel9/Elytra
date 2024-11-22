import Dashboard from '@/components/Dashboard';
import { getUserDetails } from '@/utils';
import { redirect } from 'next/navigation';
import React from 'react'

const page =async  () => {
    const session = await getUserDetails();
  if (!session) {
    redirect(`/`);
  } 
  return (
    <div>
        <Dashboard/>
    </div>
  )
}

export default page
