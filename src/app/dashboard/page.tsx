import { checkStudentApplicationFilled } from "@/actions/onFilled";
import Dashboard from "@/components/dashboard/Dashboard";
import AICounselingChatbot from "@/components/video-bot/AICounselingChatbot";
import { getUserDetails } from "@/utils";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  // Get user session
  const session = await getUserDetails();
      const { user } = await getUserDetails();


  // Redirect to home if no session exists
  if (!session) {
    redirect("/");
  }

  // Check if the application is filled
  const filled = await checkStudentApplicationFilled(session.user.id);

  // Optionally redirect to fill information
  if (!filled) {
    redirect("/student/student-info");
  }

  return (
    <>
              <AICounselingChatbot user={user} />

    </>
  );
};

export default Page;
