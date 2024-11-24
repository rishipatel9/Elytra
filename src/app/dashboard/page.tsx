import Dashboard from "../../components/Dashboard";
import { getUserDetails } from "../../utils";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getUserDetails();

  if (!session) {
    redirect("/");
  }

  return (
     <div className="min-h-screen w-full">
      {" "}
      {/* Set min-height and full width */}
 
    <div className="">
      Dashboard Page
 
      <Dashboard />
      </div>
      </div>
  );
};

export default Page;
