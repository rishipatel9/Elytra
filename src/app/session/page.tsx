
import { NEXT_AUTH } from '@/lib/auth';
// @ts-ignore
import { AuthOptions } from 'next-auth';
// @ts-ignore
import { getServerSession } from 'next-auth';

const getUserDetails = async () => {
    const session = await getServerSession(NEXT_AUTH as AuthOptions);
    console.log(session)
  return session;
}
export default async function  Dashboard() {
    const user = await getUserDetails();
  return (
    <div>
      <h1>Welcome, {JSON.stringify(user) || ""}</h1>
      <p>Email: {user?.email || ""}</p>
    </div>
  );
}

