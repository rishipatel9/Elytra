import SignUp from '@/components/auth/signup';
import { getUserDetails } from '@/utils';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const session = await getUserDetails();
  if (session) {
    redirect("/student/student-info");
  }
  return (
    <SignUp/>
  )
}

export default page
