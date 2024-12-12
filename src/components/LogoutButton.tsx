import React from 'react'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react'
import { IconLogout } from '@tabler/icons-react'

const LogoutButton = () => {
    return (
        <Button onClick={() => signOut()} className="rounded-xl gap-4 text-white">
            <div>
                <IconLogout />
            </div>
            <div>
                Logout
            </div>
        </Button>
    )
}

export default LogoutButton
