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
    title: 'Virtual Mentor',
    url: '/video-bot',
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
      <SidebarContent className="bg-[#151723]">
        <SidebarGroup>
          <SidebarGroupLabel>Elytra</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  className="py-4 px-5 font-semibold text-white text-2xl"
                  key={item.title}
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center">
                      <item.icon className="mr-3" />
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
