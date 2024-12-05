import { redirect } from 'next/navigation';
import StudentInformationForm from "../_components/StudentInformation";
import { getUserDetails } from '@/utils';
import { checkStudentApplicationFilled } from '@/actions/onFilled';

export default async function StudentInfoPage() {
  const session = await getUserDetails();

  if (!session) {
    redirect('/auth/signin');
  }
  const filled = await checkStudentApplicationFilled(session.user.id);

  if (filled) {
    redirect('/dashboard');
  }

  return <StudentInformationForm  />;
}