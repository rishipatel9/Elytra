import SignIn from '@/components/auth/signin'
import { getUserDetails } from '@/utils';
import { redirect } from 'next/navigation';

const page =async  () => {
  const session = await getUserDetails();
  // if (session) {
  //   redirect("/student/student-info");
  // }
  return (
      <SignIn/>
  )
}

export default page
