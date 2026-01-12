import { type NextRequest, NextResponse } from "next/server"

const downloadStats: Record<number, { count: number; file: string }> = {}

export async function POST(request: NextRequest) {
  try {
    const { rollNumber } = await request.json()

    if (!rollNumber || rollNumber < 1 || rollNumber > 50) {
      return NextResponse.json({ error: "Invalid roll number" }, { status: 400 })
    }

    const cycle = ((rollNumber - 1) % 3) + 1
    const file = `file${cycle}.pdf`

    // Update stats
    if (!downloadStats[rollNumber]) {
      downloadStats[rollNumber] = { count: 0, file }
    }
    downloadStats[rollNumber].count++

    return NextResponse.json({
      success: true,
      rollNumber,
      file,
      totalDownloads: downloadStats[rollNumber].count,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to track download" }, { status: 500 })
  }
}
