'use client';
import { Calendar, Home, Inbox, User } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation'; // Use this for getting the current path

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'AI Counseling',
    url: '/dashboard/AI-Counseling',
    icon: User,
  },
  {
    title: 'Program Finder',
    url: '/dashboard/programs',
    icon: Inbox,
  },
  {
    title: 'Ask a Counselor',
    url: '/dashboard/counselor',
    icon: Calendar,
  },
];

export function AppSidebar() {
  const pathname = usePathname(); // Get the current pathname

  return (
    <Sidebar>
      <SidebarContent className="bg-[#F5F5F4] text-black shadow-lg">
        {/* Sidebar Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-normal text-black bg-white shadow-sm p-4 mb-6 mt-1 border  text-left">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <p className="text-[#888888] text-sm px-4 mb-2">WorkSpace</p>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url; // Check if the item is active
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn(
                      "py-1 rounded-md",
                      'font-medium text-xl text-black',
                      'transition-all duration-300 ease-in-out',
                      'group',
                      isActive ? 'bg-white border shadow-sm  ' : '' 
                    )}
                  >
                    <SidebarMenuButton asChild className='hover:bg-none'>
                      <a
                        href={item.url}
                        className={cn(
                          'flex items-center space-x-3 w-full p-3 rounded-lg ',
                          'text-black' 
                        )}
                      >
                        <item.icon
                          className={cn(
                            'text-black ',
                            'transition-colors duration-300'
                          )}
                          strokeWidth={1.5}
                          size={20}
                        />
                        <span className="  transition-colors duration-300">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}