'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { renderSkeletonRows } from '@/components/video-bot/UserSessions';
import SearchSession from '@/components/video-bot/SearchSessions';
import { Badge } from '@/components/ui/Badge';
export type UserData = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    plan: string;
};
const page = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    // Fetch user sessions from the backend
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('/api/analytics/users');
                // console.log(response.data.data)
                if (response.data) {
                    setUsers(response.data.data);
                } else {
                    console.error(response.data.error);
                }
            } catch (error) {
                console.error("Error fetching sessions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

  return (
    <div className="w-full md:mt-10 md:px-12 px-4">
    <div className='flex justify-between items-center '>
        <h1 className=" scroll-mt-8 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
            Users
            <div className='text-sm text-[#ffffff64]'>Manager Users</div>
        </h1>
        <div className='flex justify-center items-center gap-2'>
            <SearchSession onSearch={() => { }} />
        </div>
    </div>
    <div className="rounded-xl mt-4 border dark:border-[#3B4254] border-[#E9ECF1] shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100 dark:bg-[#212A39] rounded-t-xl">
                            <TableHead className="border-b dark:border-[#3B4254] px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 ">
                                Name
                            </TableHead>
                            <TableHead className="border-b dark:border-[#3B4254] px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Email
                            </TableHead>
                            <TableHead className="border-b dark:border-[#3B4254] px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Created At
                            </TableHead>
                            <TableHead className="border-b dark:border-[#3B4254] px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Plan
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            renderSkeletonRows() // Display skeleton loading
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-gray-100 dark:hover:bg-[#2C3545] border-b dark:border-[#3B4254]">
                                    <TableCell className="px-4 py-3">{user.name}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        {user.email || 'No email available'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">{new Date(user.createdAt).toLocaleString()}</TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <Badge>{user.plan}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                    No sessions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
    </div>
  )
}

export default page
