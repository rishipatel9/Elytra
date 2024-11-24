import AdminLogin from '@/components/Admin/AdminLogin'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'


const page = async (): Promise<JSX.Element | null> => {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("adminToken")?.value;
    if (adminToken) {
        redirect("/admin/dashboard");
    }
    return (
        <div>
            <AdminLogin />
        </div>
    );


}

export default page
