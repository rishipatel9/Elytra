import React from 'react'
import { Button } from '../ui/button';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IconLogout } from '@tabler/icons-react';


const AdminLogout = () => {
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const response = await fetch("/api/admin/logout", {
                method: "POST",
            });

            if (response.ok) {
                console.log("Logout successful");
                toast.success("Logout successful");
                localStorage.removeItem("authToken");
                router.push("/auth/signin");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <Button onClick={handleLogout} className="rounded-xl gap-4 text-white">
            <div>
                <IconLogout />
            </div>
            <div>
                Logout
            </div>
        </Button>
    )
}

export default AdminLogout
