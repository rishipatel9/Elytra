'use client'
import { GraduationCap, User } from 'lucide-react';
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
import { useLocation } from 'react-router-dom';
import { usePathname } from 'next/navigation';

// Menu items.
const items = [
    {
        title: 'Programs',
        url: '/admin/dashboard',
        icon: GraduationCap,
    },
    {
        title: 'AI Counseling',
        url: '/',
        icon: User,
    },
];

export function AdminSidebar() {
    const pathname = usePathname(); // Get the current pathname

    return (
        <Sidebar>
            <SidebarContent
                className="bg-[#0A0A0A] text-[#888888] shadow-2xl border-r border-[#2D2D2D] w-64"
            >
                <SidebarGroup>
                    <SidebarGroupLabel className="text-base font-semibold text-gray-300 bg-[#000000] shadow-md p-4 mb-4 mt-1 border border-[#2D2D2D]  text-left">
                        Admin Dashboard
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <p className="text-[#888888] text-sm px-4 mb-2">WorkSpace</p>
                        <SidebarMenu>
                            {items.map((item) => {
                               const isActive = pathname === item.url // Check if the item is active
                                return (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={cn(
                                            'font-medium text-lg text-[#888888]',
                                            // 'hover:shadow-lg hover:scale-[1.03]',
                                            'transition-all duration-300 ease-in-out',
                                            'group',
                                            isActive && 'border-l-4 border-blue-500 bg-[#1A1A1A]' ,
                                        )}
                                    >
                                        <SidebarMenuButton asChild>
                                            <a
                                                href={item.url}
                                                className={cn(
                                                    'flex items-center space-x-3 w-full p-3 rounded-lg',
                                                    isActive && 'text-white' // Active text color
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        'text-[#888888] group-hover:text-white',
                                                        'transition-colors duration-300',
                                                        isActive && 'text-blue-500' // Active icon color
                                                    )}
                                                    strokeWidth={1.5}
                                                    size={20}
                                                />
                                                <span className="group-hover:text-white transition-colors duration-300">
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

            {/* Branding/Footer */}
            <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="flex items-center space-x-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
                    {/* Circle Avatar */}
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xl">A</span>
                    </div>
                    {/* Text */}
                    <div>
                        <p className="text-sm font-medium text-gray-300">Admin Panel</p>
                        <p className="text-xs text-gray-500">v1.0.0</p>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
