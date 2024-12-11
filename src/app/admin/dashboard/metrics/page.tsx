import { PieChartComponent } from '@/components/ui/PieChart'
import { chartConfig, chartData } from '@/data'
import React from 'react'

const page = () => {
  return (
    <div className="h-screen w-full border rounded-xl bg-background dark:bg-[#202434] dark:border-[#293040] border-[#E9ECF1] px-4 md:px-14 py-6 overflow-y-auto">
    <h1
      id="usage-overview"
      className=" scroll-mt-8 text-lg border-b p-2 m-6  font-semibold text-gray-900 sm:text-xl dark:text-gray-50 dark:bg-[#202434] dark:border-[#293040] border-[#E9ECF1]  pb-4 pt-4 sm:pt-6 lg:top-0 lg:mx-0 lg:px-0 lg:pt-8 "
    >
      Metrics
    </h1>

      <div className='mt-10 grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
        <PieChartComponent chartData={chartData} chartConfig={chartConfig} />
        <PieChartComponent chartData={chartData} chartConfig={chartConfig} />
        <PieChartComponent chartData={chartData} chartConfig={chartConfig} />
        <PieChartComponent chartData={chartData} chartConfig={chartConfig} />
        <PieChartComponent chartData={chartData} chartConfig={chartConfig} />
      </div>

    </div>
  )
}

export default page
