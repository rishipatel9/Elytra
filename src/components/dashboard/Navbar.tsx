'use client'
import React from 'react';

import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

interface UserSession {
  name: string;
  image: string;
  email: string;
}



const MainNav = () => {
  return (
    <header className="w-full flex items-center h-14 md:px-6 px-4 bg-[#0A0A0A] top-0 left-0 z-20 border-b border-[#2D2D2D]">
      <div aria-label="Homepage" className="md:flex items-center hidden">
        Elytra
      </div>

      <p className="text-[#525050] text-2xl px-3 md:inline hidden">/</p>

      <div className="flex items-center gap-2">
        {/* {name?.image && ( */}
          {/* <Image
            src={""}
            alt="Profile image"
            width={32}
            height={32}
            className="rounded-full border-2 border-[#2D2D2D]"
          /> */}
        {/* )} */}
        <p className="text-[#EDEDED] text-base ">
          {/* {name ? `${name.name}'s projects` : 'User'} */}
        </p>
      </div>

      <svg
        className="ml-4 sm:block hidden"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        width="24"
        style={{ color: "var(--accents-2)" }}
      >
        <path d="M16.88 3.549L7.12 20.451"></path>
      </svg>


      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* {name?.image && ( */}
              {/* <Image
                src={""}
                alt="Profile image"
                width={36}
                height={36}
                className="rounded-full border-2 border-[#2D2D2D] md:inline hidden"
              /> */}
            {/* )} */}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-6 mr-6 p-2 rounded-md text-[#8E8E8E] focus-visible:false border-2 z-50  border-[#27272B] bg-black">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#27272B]" />
            <DropdownMenuGroup>
              <DropdownMenuItem className='py-2'>
                <Link href="/session">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='py-2'>
                <Link href="/" target='_main'>Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='py-2' >
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-[#27272B]" />
            <DropdownMenuSeparator className="bg-[#27272B]" />
            <DropdownMenuLabel>Connect</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#27272B]" />
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default MainNav;
