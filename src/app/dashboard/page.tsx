import { checkStudentApplicationFilled } from "@/actions/onFilled";
import Dashboard from "../../components/dashboard/Dashboard";
import { getUserDetails } from "../../utils";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getUserDetails();

  if (!session) {
    redirect("/");
  }
  const filled = await checkStudentApplicationFilled(session.user.id);

  // if(!filled){
  //   redirect('/student/student-info');
  // }

  return (
     <div className="min-h-screen w-full"> 
       <Dashboard />
      </div>
  );
};

export default Page;
