"use client";
import React, { use, useState } from "react";
import {
  IconUser,
  IconHome,
  IconCalendar,
  IconInbox
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ModeToggle } from "./theme-toggle";
import LogoutButton from "./LogoutButton";
import { Brain } from "lucide-react";



export default function SidebarDemo({ children }: { children: React.ReactNode }) {
    // className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" 
    const links = [
        {
          label: "Home",
          href: "/dashboard",
          icon: (
            <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
        {
          label: "Program Finder",
          href: "/dashboard/programs", // changed key to href
          icon: (
            <IconInbox className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
        {
          label: "Ask a Counselor",
          href: "/dashboard/counselor", // changed key to href
          icon: (
            <IconCalendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
      ];
  const [open, setOpen] = useState(false);
  const pathname= usePathname();
  
  
  return (
    <div
    className={cn(
      "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-[#222939] w-full flex-1 h-screen border p-2 border-neutral-200 dark:border-neutral-700 overflow-hidden font-sans"
    )}
  >
    <Sidebar open={open} setOpen={setOpen}>
    
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden ">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2  ">
            {links.map((link, idx) => {
              const isActive = pathname === link.href; 
              return (
                <SidebarLink link={link} key={idx}/>
              );
            })}
          </div>
        </div>
        <div className="">
        <ModeToggle/>
            <SidebarLink
              link={{
                label: "User",
                href: "/profile",
                icon: (
                    <Avatar>
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                ),
              }}
            />
          <LogoutButton/>
          </div>
      </SidebarBody>
    </Sidebar>
    <div className="flex-1 rounded-xl border dark:border-[#293040] border-[#E9ECF1] shadow-lg overflow-y-auto">{children}</div>
  </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
    <LogoIcon/>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl text-black dark:text-white whitespace-pre font-bold"
      >
        Elytra
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Brain className="h-6 w-6 text-purple-500" />
  );
};

const Dashboard = () => {
    return (
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
          <div className="flex gap-2">
            {[...new Array(4)].map((_, index) => (
              <div
                key={index} // Use the index as the key
                className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
              ></div>
            ))}
          </div>
          <div className="flex gap-2 flex-1">
            {[...new Array(2)].map((_, index) => (
              <div
                key={index} // Use the index as the key
                className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  