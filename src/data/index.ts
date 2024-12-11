import { ChartConfig } from "@/components/ui/chart"

export type Usage = {
    owner: string
    status: string
    costs: number
    region: string
    stability: number
    lastEdited: string
  }
  
  export type OverviewData = {
    date: string
    "Rows written": number
    "Rows read": number
    Queries: number
    "Payments completed": number
    "Sign ups": number
    Logins: number
  }
  
  export const chartData2 = [
    { platform: "Windows", visitors: 320, fill: "var(--color-windows)" },
    { platform: "MacOS", visitors: 210, fill: "var(--color-macos)" },
    { platform: "Linux", visitors: 100, fill: "var(--color-linux)" },
    { platform: "Android", visitors: 150, fill: "var(--color-android)" },
    { platform: "iOS", visitors: 130, fill: "var(--color-ios)" },
  ]
  export const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
  ]
  
  
  export const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig