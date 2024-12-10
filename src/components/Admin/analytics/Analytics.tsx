'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card'; 
import axios from 'axios';
import { ChartCard } from './DashboardChatCard';
import { OverviewData } from '@/data';
import { DateRange } from "react-day-picker"
import { subDays, toDate } from "date-fns"
import { overviews } from '@/data/overview-data';
import { Filterbar } from './DashboardFilterbar';
import { cx } from '@/lib/utils';
import { PieChartComponent } from '@/components/ui/PieChart';
export type KpiEntry = {
  title: string;
  percentage: number;
  current: number;
  allowed: number;
  unit?: string;
};

const Analytics = () => {
  const [data, setData] = useState<any>(null); 
  const [loading, setLoading] = useState(true); 
  const [programData, setProgramData] = useState<KpiEntry[]>([]); 

  const overviewsDates = overviews.map((item) => toDate(item.date).getTime())
  const maxDate = toDate(Math.max(...overviewsDates))

  const [selectedDates, setSelectedDates] = React.useState<
    DateRange | undefined
  >({
    from: subDays(maxDate, 30),
    to: maxDate,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/analytics'); 
        const result = response.data;
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (data) {
      setProgramData([
        { title: "Total Users", percentage: (data?.totalUsers || 0) / 100, current: data?.totalUsers || 0, allowed: 100 },
        { title: "Applications Completed", percentage: (data?.usersWithApplications || 0) / 100, current: data?.usersWithApplications || 0, allowed: 100 },
        { title: "Active Sessions", percentage: (data?.activeSessions || 0) / 100, current: data?.activeSessions || 0, allowed: 100 },
        { title: "Recent Chats", percentage: (data?.recentChats || 0) / 100, current: data?.recentChats || 0, allowed: 100 },
        { title: "Top Tier Programs", percentage: (data?.programsByCategory[1]?._count.id || 0) / 100, current: 1, allowed: 27 },
      ]);
    }
  }, [data]); 

  const categories: {
    title: keyof OverviewData
    type: "currency" | "unit"
  }[] = [
    // {
    //   title: "Rows read",
    //   type: "unit",
    // },
    // {
    //   title: "Rows written",
    //   type: "unit",
    // },
    // {
    //   title: "Queries",
    //   type: "unit",
    // },
    // {
    //   title: "Payments completed",
    //   type: "currency",
    // },
    {
      title: "Sign ups",
      type: "unit",
    },
    {
      title: "Logins",
      type: "unit",
    },
  ]

  
  return (
    <div className="h-screen w-full border rounded-xl bg-background dark:bg-[#202434] dark:border-[#293040] border-[#E9ECF1] px-4 md:px-16 py-6 overflow-y-auto">
        <h1
          id="usage-overview"
          className=" scroll-mt-8 text-lg border-b p-2 m-6  font-semibold text-gray-900 sm:text-xl dark:text-gray-50 dark:bg-[#202434] dark:border-[#293040] border-[#E9ECF1]  pb-4 pt-4 sm:pt-6 lg:top-0 lg:mx-0 lg:px-0 lg:pt-8 "
        >
          Overview
        </h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programData.map((program, index) => (
            <Card key={index} className="w-full border rounded-xl overflow-hidden bg-background dark:bg-[#212A39] dark:border-[#3B4254] border-[#E9ECF1] shadow-sm transition-all duration-300 font-sans">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#222939] dark:text-white">
                      {program.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-[#8F8F8F]">Program Details</p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700 dark:text-[#8F8F8F]">
                  <p>
                    <span className="font-medium text-[#222939] dark:text-white">
                      Current:
                    </span> {program.current || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium text-[#222939] dark:text-white">
                      Allowed:
                    </span> {program.allowed || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium text-[#222939] dark:text-white">
                      Percentage:
                    </span> {`${Math.round(program.percentage * 100)}%`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {program.title} data details are shown above.
                  </p>
                  <a href="#" className="text-blue-500 hover:underline text-sm mt-2 inline-block">
                    Manage Settings
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
     <h1
          id="usage-overview"
          className="mt-16 scroll-mt-8 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Overview
        </h1>
        <div className="sticky top-16 z-20 flex items-center justify-between border-b bg-background dark:bg-[#202434] dark:border-[#293040] border-[#E9ECF1]  pb-4 pt-4 sm:pt-6 lg:top-0 lg:mx-0 lg:px-0 lg:pt-8 ">
          <Filterbar
            maxDate={maxDate}
            minDate={new Date(2024, 0, 1)}
            selectedDates={selectedDates}
            onDatesChange={(dates) => setSelectedDates(dates)}
          />
        </div>
        <dl
          className={cx(
            "mt-10 grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {categories.map((category) => {
            return (
              <ChartCard
                key={category.title}
                title={category.title}
                type={category.type}
                selectedDates={selectedDates}
                selectedPeriod={"last-year"}
              />
            )
          })}
        <PieChartComponent/>
        </dl>
    </div>
  );
};

export default Analytics;

export type PeriodValue = "previous-period" | "last-year" | "no-comparison"