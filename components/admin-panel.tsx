"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DownloadStat {
  rollNumber: number
  count: number
  file: string
}

export default function AdminPanel() {
  const [stats, setStats] = useState<DownloadStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRoll, setSelectedRoll] = useState<string>("01")
  const [downloadLoading, setDownloadLoading] = useState(false)

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
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const getFileForRoll = (rollNumber: number) => {
    const cycle = ((rollNumber - 1) % 3) + 1
    const fileNames = ["Set A", "Set B", "Set C"]
    return {
      file: `${fileNames[cycle - 1]}.pdf`,
      placeholder: `https://placeholder-file${cycle}-url`,
    }
  }

  const handleAdminDownload = async () => {
    const rollNumber = Number.parseInt(selectedRoll)
    const { file, placeholder } = getFileForRoll(rollNumber)

    setDownloadLoading(true)
    try {
      const fileUrl = placeholder
      const link = document.createElement("a")
      link.href = fileUrl
      link.download = file
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setDownloadLoading(false)
    }
  }

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
    setA: stats.filter((s) => s.file.includes("1")).reduce((sum, s) => sum + s.count, 0),
    setB: stats.filter((s) => s.file.includes("2")).reduce((sum, s) => sum + s.count, 0),
    setC: stats.filter((s) => s.file.includes("3")).reduce((sum, s) => sum + s.count, 0),
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Admin Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Download statistics and unrestricted file access</p>
        </div>

        {/* Admin Download Section */}
        <Card className="p-8 border border-border/50 shadow-lg mb-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Unrestricted Download</h2>
            <p className="text-muted-foreground">Download any assignment file by selecting a roll number</p>

            <div className="flex gap-4 flex-col sm:flex-row">
              <Select value={selectedRoll} onValueChange={setSelectedRoll}>
                <SelectTrigger className="w-full sm:w-48 h-10 text-base border border-border/50">
                  <SelectValue placeholder="Select roll number" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {Array.from({ length: 50 }, (_, i) => {
                    const rollNum = String(i + 1).padStart(2, "0")
                    return (
                      <SelectItem key={rollNum} value={rollNum}>
                        {rollNum}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              <div className="relative inline-block">
                <div className="absolute inset-0 bg-black/20 blur-xl rounded-lg opacity-0 hover:opacity-30 transition-opacity" />
                <Button
                  onClick={handleAdminDownload}
                  disabled={downloadLoading}
                  className="h-10 bg-black hover:bg-black/90 text-white relative"
                >
                  {downloadLoading ? (
                    "Downloading..."
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading statistics...</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground font-medium">Total Downloads</p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalDownloads}</p>
              </div>
              <div className="bg-card border border-border/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground font-medium">Set A Downloads</p>
                <p className="text-3xl font-bold text-foreground mt-2">{fileDistribution.setA}</p>
              </div>
              <div className="bg-card border border-border/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground font-medium">Set B Downloads</p>
                <p className="text-3xl font-bold text-foreground mt-2">{fileDistribution.setB}</p>
              </div>
              <div className="bg-card border border-border/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground font-medium">Set C Downloads</p>
                <p className="text-3xl font-bold text-foreground mt-2">{fileDistribution.setC}</p>
              </div>
            </div>

            {/* Chart */}
            <Card className="p-8 border border-border/50 shadow-lg">
              <h3 className="font-bold text-foreground mb-4 text-lg">Downloads by Roll Number</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="rollNumber"
                    tick={{ fontSize: 11 }}
                    interval={4}
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "var(--color-foreground)" }}
                  />
                  <Bar dataKey="count" fill="var(--color-foreground)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Detailed Table */}
            <Card className="p-8 border border-border/50 shadow-lg">
              <h3 className="font-bold text-foreground mb-4 text-lg">Detailed Statistics</h3>
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
                      const fileNames = ["Set A", "Set B", "Set C"]
                      const stat = stats.find((s) => s.rollNumber === rollNum)
                      return (
                        <tr
                          key={data.rollNumber}
                          className="border-b border-border/30 hover:bg-card/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-foreground font-medium">{data.rollNumber}</td>
                          <td className="py-3 px-4 text-muted-foreground">{fileNames[cycle - 1]}.pdf</td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-foreground/10 text-foreground font-semibold">
                              {stat?.count || 0}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Made with passion by <span className="font-semibold text-foreground">Adish Sagarawat</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
