
import AICounselingChatbot from '@/components/video-bot/AICounselingChatbot';
import { getUserDetails } from '@/utils';
import React from 'react'

const page = async () => {
    const { user } = await getUserDetails();
    return (
        <AICounselingChatbot user={user} />
    )
}

export default page
