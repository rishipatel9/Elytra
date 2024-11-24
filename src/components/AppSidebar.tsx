import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Mentor",
    url: "/dashboard/mentor",
    icon: Home,
  },
  {
    title: "Programs",
    url: "/dashboard/programs",
    icon: Inbox,
  },
  {
    title: "Counselor",
    url: "/dashboard/counselor",
    icon: Calendar,
  },

]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-[#151723]">
        <SidebarGroup>
          <SidebarGroupLabel>Elytra</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="py-3 font-semibold text-white text-2xl " key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
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
  )
}
