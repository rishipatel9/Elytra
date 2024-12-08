import { Calendar, Home, Inbox, Search, Settings, User } from 'lucide-react';

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
import { title } from 'process';

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
  return (
    <Sidebar>
      <SidebarContent className="bg-[#F5F5F4] tex-black text-white shadow-lg">
        {/* Sidebar Group */}
        <SidebarGroup>
          {/* <SidebarGroupLabel className="text-xl font-bold tracking-wide text-gray-300">
            Elytra
          </SidebarGroupLabel> */}

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  className="py-3 px-5 font-semibold text-2xl text-black hover:bg-gray-700/50 rounded-md transition duration-150"
                  key={item.title}
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center">
                      <item.icon className="mr-3 text-black transition" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
