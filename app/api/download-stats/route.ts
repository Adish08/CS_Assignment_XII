import { type NextRequest, NextResponse } from "next/server"

const downloadStats: Record<number, { count: number; file: string }> = {}

export async function GET(request: NextRequest) {
  try {
    // Return all stats as an array
    const stats = Object.entries(downloadStats).map(([rollNum, data]) => ({
      rollNumber: Number.parseInt(rollNum),
      count: data.count,
      file: data.file,
    }))

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
