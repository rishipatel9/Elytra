"use client";

import LandingPage from "@/components/Landing/LandingPage";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const session = getSession();
  const handleClick = () => {
    router.push("/student/student-info");
  };

  return (
      <LandingPage/>
  );
}
