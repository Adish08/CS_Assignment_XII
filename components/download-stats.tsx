"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DownloadStat {
  rollNumber: number
  count: number
  file: string
}

export default function DownloadStats() {
  const [stats, setStats] = useState<DownloadStat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/download-stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch download stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Loading statistics...</p>
      </Card>
    )
  }

  // Prepare data for chart
  const chartData = Array.from({ length: 50 }, (_, i) => {
    const rollNum = i + 1
    const stat = stats.find((s) => s.rollNumber === rollNum)
    return {
      rollNumber: String(rollNum).padStart(2, "0"),
      count: stat?.count || 0,
    }
  })

  const totalDownloads = stats.reduce((sum, stat) => sum + stat.count, 0)
  const fileDistribution = {
    file1: stats.filter((s) => s.file === "file1.pdf").reduce((sum, s) => sum + s.count, 0),
    file2: stats.filter((s) => s.file === "file2.pdf").reduce((sum, s) => sum + s.count, 0),
    file3: stats.filter((s) => s.file === "file3.pdf").reduce((sum, s) => sum + s.count, 0),
  }

  return (
    <Card className="p-8 border-2 border-primary/20 shadow-lg">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Download Statistics</h2>
          <p className="text-muted-foreground">Track how many students have downloaded each project file</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">Total Downloads</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{totalDownloads}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">File 1 Downloads</p>
            <p className="text-3xl font-bold text-green-900 mt-2">{fileDistribution.file1}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-700 font-medium">File 2 Downloads</p>
            <p className="text-3xl font-bold text-purple-900 mt-2">{fileDistribution.file2}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-700 font-medium">File 3 Downloads</p>
            <p className="text-3xl font-bold text-orange-900 mt-2">{fileDistribution.file3}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card/50 rounded-lg p-4 border border-border/50">
          <h3 className="font-semibold text-foreground mb-4">Downloads by Roll Number</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="rollNumber" tick={{ fontSize: 11 }} interval={4} stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* File Distribution Table */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Detailed Statistics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Roll Number</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Assigned File</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Downloads</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((data, index) => {
                  const rollNum = index + 1
                  const cycle = ((rollNum - 1) % 3) + 1
                  const stat = stats.find((s) => s.rollNumber === rollNum)
                  return (
                    <tr key={data.rollNumber} className="border-b border-border/30 hover:bg-card/50 transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{data.rollNumber}</td>
                      <td className="py-3 px-4 text-muted-foreground">file{cycle}.pdf</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                          {stat?.count || 0}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  )
}
