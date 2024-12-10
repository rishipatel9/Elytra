
// import { KpiEntry } from "@/app/(main)/overview/page"
import { Badge } from "@/components/ui/Badge"
import { ProgressBar } from "@/components/ui/ProgressBar"

export type CardProps = {
  title: string
  change: string
  value: string
  valueDescription: string
  ctaDescription: string
  ctaText: string
  ctaLink: string
  data: KpiEntry[]
}

export type KpiEntry = {
    title: string
    percentage: number
    current: number
    allowed: number
    unit?: string
  }
const data2: KpiEntry[] = [
    {
      title: "Weekly active users",
      percentage: 21.7,
      current: 21.7,
      allowed: 100,
      unit: "%",
    },
    {
      title: "Total users",
      percentage: 70,
      current: 28,
      allowed: 40,
    },
    {
      title: "Uptime",
      percentage: 98.3,
      current: 98.3,
      allowed: 100,
      unit: "%",
    },
  ]
export type KpiEntryExtended = Omit<
  KpiEntry,
  "current" | "allowed" | "unit"
> & {
  value: string
  color: string
}

export const data3: KpiEntryExtended[] = [
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
export function ProgressBarCard({
  title,
  change,
  value,
  valueDescription,
  ctaDescription,
  ctaText,
  ctaLink,
  data,
}: CardProps) {
  return (
    <>
      <div className="flex flex-col justify-between  bg-background dark:bg-[#212A39] dark:border-[#293040] border-[#E9ECF1] p-4 rounded-xl shadow-lg ">
        <div>
          <div className="flex items-center gap-2">
            <dt className="font-bold text-gray-900 sm:text-sm dark:text-gray-50">
              {title}
            </dt>
            <Badge variant="neutral">{change}</Badge>
          </div>
          <dd className="mt-2 flex items-baseline gap-2">
            <span className="text-xl text-gray-900 dark:text-gray-50">
              {value}
            </span>
            <span className="text-sm text-gray-500">{valueDescription}</span>
          </dd>
          <ul role="list" className="mt-4 space-y-5">
            {data.map((item) => (
              <li key={item.title}>
                <p className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {item.title}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {item.current}
                    <span className="font-normal text-gray-500">
                      /{item.allowed}
                      {item.unit}
                    </span>
                  </span>
                </p>
                <ProgressBar
                  value={item.percentage}
                  className="mt-2 [&>*]:h-1.5"
                />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mt-6 text-xs text-gray-500">
            {ctaDescription}{" "}
            <a href={ctaLink} className="text-indigo-600 dark:text-indigo-400">
              {ctaText}
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
