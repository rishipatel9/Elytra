import { KpiEntry, KpiEntryExtended } from "@/components/Admin/analytics/ProgressBarCard";

export const data2: KpiEntry[] = [
    {
      title: 'Weekly active users',
      percentage: 21.7,
      current: 21.7,
      allowed: 100,
      unit: '%',
    },
    {
      title: 'Total users',
      percentage: 70,
      current: 28,
      allowed: 40,
    },
    {
      title: 'Uptime',
      percentage: 98.3,
      current: 98.3,
      allowed: 100,
      unit: '%',
    },
  ];
  const data3: KpiEntryExtended[] = [
    {
      title: "Base tier",
      percentage: 68.1,
      value: "$200",
      color: "bg-indigo-600 dark:bg-indigo-500",
    },
    {
      title: "On-demand charges",
      percentage: 20.8,
      value: "$61.1",
      color: "bg-purple-600 dark:bg-purple-500",
    },
    {
      title: "Caching",
      percentage: 11.1,
      value: "$31.9",
      color: "bg-gray-400 dark:bg-gray-600",
    },
  ]