"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, FileText, HousePlug, Proportions } from "lucide-react";
import {
  CreateItem,
  CustomerIcon,
  HomeIcon,
  ItemIcon,
  MoneyIcon,
  PurchaseIcon,
  SalesIcon,
  VendorIcon,
  Warehouse,
} from "@/components/icons/icons";
import { usePathname } from "next/navigation";

interface DropdownMenuItemProps {
  label: string;
  icon: React.ReactNode;
  items: { label: string; href: string }[];
  isSidebarOpen: boolean;
}

const DropdownMenuItem = ({
  label,
  icon,
  items,
  isSidebarOpen,
}: DropdownMenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full group">
      <button
        className={`
          w-full flex items-center px-4 py-2
          text-gray-800 hover:text-black
          transition-colors duration-200
          ${isOpen ? "bg-gray-100" : "hover:bg-gray-50"}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="w-6 h-6 flex-shrink-0">{icon}</span>
        {isSidebarOpen && (
          <div className="flex items-center flex-grow">
            <span className="ml-3">{label}</span>
            <ChevronDown
              className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        )}
      </button>

      {isOpen && isSidebarOpen && (
        <div className="absolute left-0 top-full w-full bg-white border-x border-b border-gray-200 shadow-lg rounded-b-lg overflow-hidden z-20">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors duration-200 pl-10"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export function ConditionalSidebar() {
  const pathname = usePathname();
  return pathname === "/dashboard" ? <SideBar /> : null;
}

export function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={`
        menu fixed flex flex-col gap-1 z-10 py-6
        text-gray-800 bg-white border-r border-gray-200 shadow-lg
        min-h-screen items-start
        w-[72px] hover:w-56
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-56" : "w-20"}
      `}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
    >
      {/* Main Menu Items */}
      <Link href="/" className="w-full">
        <div className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black transition-colors duration-200">
          <HomeIcon />
          {isSidebarOpen && <span className="ml-3">Dashboard</span>}
        </div>
      </Link>

      <div className="w-full border-t border-gray-200 my-2" />

      {/* Updated Links */}
      <Link href="/ai-call" className="w-full">
        <div className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black transition-colors duration-200">
          <CustomerIcon />
          {isSidebarOpen && <span className="ml-3">Virtual Mentor</span>}
        </div>
      </Link>

      <Link href="/programs" className="w-full">
        <div className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black transition-colors duration-200">
          <VendorIcon />
          {isSidebarOpen && <span className="ml-3">Study Programs Abroad</span>}
        </div>
      </Link>

      <Link href="/human-counselor" className="w-full">
        <div className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-black transition-colors duration-200">
          <MoneyIcon />
          {isSidebarOpen && <span className="ml-3">Ask as Counselor</span>}
        </div>
      </Link>
    </div>
  );
}
