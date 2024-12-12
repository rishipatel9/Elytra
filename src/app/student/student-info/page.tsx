import { redirect } from 'next/navigation';
import StudentInformationForm from "../_components/StudentInformation";
import { getUserDetails } from '@/utils';
import { checkStudentApplicationFilled } from '@/actions/onFilled';

export default async function StudentInfoPage() {
  const session = await getUserDetails();

  if (!session) {
    redirect('/auth/signup');
  }
  const filled = await checkStudentApplicationFilled(session.user.email);

  if (filled) {
    redirect('/dashboard');
  }

  return <StudentInformationForm  />;
}