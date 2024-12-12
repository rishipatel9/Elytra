
import AICounselingChatbot from '@/components/video-bot/AICounselingChatbot';
import { getUserDetails } from '@/utils';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const { user } = await getUserDetails();
    if(!user){
        redirect('/auth/signup');
    }
    return (
        <AICounselingChatbot user={user} />
    )
}

export default page
