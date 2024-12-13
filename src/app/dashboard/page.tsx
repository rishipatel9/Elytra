import { checkStudentApplicationFilled } from "@/actions/onFilled";
import Dashboard from "@/components/dashboard/Dashboard";
import AICounselingChatbot from "@/components/video-bot/AICounselingChatbot";
import { getUserDetails } from "@/utils";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getUserDetails();
  console.log(session)
  if (!session) {
    redirect("/");
  }
  const filled = await checkStudentApplicationFilled(session.user.email);
  if (!filled) {
    redirect("/student/student-info");
  }
  return (
    <>
      <AICounselingChatbot user={session.user} />
    </>
  );
};

export default Page;
