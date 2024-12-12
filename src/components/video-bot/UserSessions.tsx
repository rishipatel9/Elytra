'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SearchSession from './SearchSessions';
import { PlusIcon } from '@/icons/icons';
import { Spinner } from '@nextui-org/react';
import useAvtarSession from '@/hooks/useAvtarSession';


export type SessionData = {
    id: string;
    summary: string | null;
    createdAt: string;
    chats: {
        id: string;
        message: string;
        sender: "AI" | "USER";
        createdAt: string;
    }[];
};

interface UserSessionsTableProps {
    onStartSession: () => void;
    startLoading: boolean;
}
  
const UserSessionsTable = ({onStartSession,startLoading}:UserSessionsTableProps) => {
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    // Fetch user sessions from the backend
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('/api/sessions');
                if (response.data.success) {
                    setSessions(response.data.data);
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

    const toggleExpand = (id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const truncateText = (text: string, limit: number) => {
        return text.length > limit ? `${text.substring(0, limit)}...` : text;
    };

    // Skeleton Placeholder Rows (No external library)
   

    return (
        <div className="w-full md:mt-10 p-4">
            <div className='md:flex  justify-between items-center '>
                <h1 className=" scroll-mt-8 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
                    Overview
                    <div className='text-sm text-[#ffffff64]'>Manager Session and Create</div>
                </h1>
                <div className='flex justify-center items-center gap-2'>
                    <SearchSession onSearch={() => { }} />
                    <Button  onClick={onStartSession} className="flex items-center px-6 py-3 md:px-8 border rounded-xl   dark:border-[#3B4254]  border-[#E9ECF1]   font-medium  hover:bg-[#633fab] h-[2.5rem]">
                        <span className="h-5 w-5 md:hidden">
                            <PlusIcon />
                        </span>
                        <span className=" md:inline"> {startLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-black border-white"></div>
                            </div>
                        ) : (
                            "Create"
                        )}</span>
                    </Button>
                </div>
            </div>
            <div className="rounded-xl border dark:border-[#3B4254] border-[#E9ECF1] shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100 dark:bg-[#212A39] rounded-t-xl">
                            <TableHead className="border-b dark:border-[#3B4254] px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 ">
                                Session ID
                            </TableHead>
                            <TableHead className="border-b dark:border-[#3B4254] px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Summary
                            </TableHead>
                            <TableHead className="border-b dark:border-[#3B4254] px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Created At
                            </TableHead>
                            <TableHead className="border-b dark:border-[#3B4254] px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            renderSkeletonRows() // Display skeleton loading
                        ) : sessions.length > 0 ? (
                            sessions.map((session) => (
                                <TableRow key={session.id} className="hover:bg-gray-100 dark:hover:bg-[#2C3545] border-b dark:border-[#3B4254]">
                                    <TableCell className="px-4 py-3">{session.id}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        {expandedRows.has(session.id) ? (
                                            <>
                                                {session.summary || 'No summary available'}
                                                <button
                                                    onClick={() => toggleExpand(session.id)}
                                                    className="text-blue-500 hover:underline ml-2"
                                                >
                                                    Read Less
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {truncateText(session.summary || 'No summary available', 50)}
                                                {session.summary && session.summary.length > 50 && (
                                                    <button
                                                        onClick={() => toggleExpand(session.id)}
                                                        className="text-blue-500 hover:underline ml-2"
                                                    >
                                                        Read More
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">{new Date(session.createdAt).toLocaleString()}</TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <Button variant="outline" className="text-blue-500 hover:text-blue-700">
                                            Continue
                                        </Button>
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
    );
};

export default UserSessionsTable;

export const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="animate-pulse">
            <TableCell className="px-4 py-3 border-b dark:border-[#3B4254]">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded "></div>
            </TableCell>
            <TableCell className="px-4 py-3 border-b dark:border-[#3B4254]">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </TableCell>
            <TableCell className="px-4 py-3 border-b dark:border-[#3B4254]">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </TableCell>
            <TableCell className="px-4 py-3 text-center border-b dark:border-[#3B4254]">
                <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </TableCell>
        </TableRow>
    ));
};