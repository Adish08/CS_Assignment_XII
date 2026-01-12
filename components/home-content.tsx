"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, Download, Lock, Code2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import GuidesModal from "@/components/guides-modal"
import AdminPanel from "@/components/admin-panel"

export default function HomeContent() {
  const searchParams = useSearchParams()
  const isAdminMode = searchParams.get("admin") === "true"
  const isReset = searchParams.get("reset") === "true"

  const [selectedRoll, setSelectedRoll] = useState<string>("")
  const [lockedRoll, setLockedRoll] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [downloadMessage, setDownloadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [error, setError] = useState<string>("")
  const [showModal, setShowModal] = useState(true)
  const [showMainContent, setShowMainContent] = useState(false)

  useEffect(() => {
    if (isReset) {
      document.cookie = "lockedRoll=; path=/; max-age=0"
      setLockedRoll(null)
      setSelectedRoll("")
      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      const cookies = document.cookie.split("; ")
      const rollCookie = cookies.find((c) => c.startsWith("lockedRoll="))
      if (rollCookie) {
        const roll = rollCookie.split("=")[1]
        setLockedRoll(roll)
        setSelectedRoll(roll)
        setShowModal(false)
        setShowMainContent(true)
      }
    }
  }, [isReset])

  const handleRollSelect = (value: string) => {
    if (lockedRoll && lockedRoll !== value) {
      setError(
        `You can only download the file associated with your previously selected roll number (${lockedRoll}). Please select roll number ${lockedRoll} to proceed.`,
      )
      setSelectedRoll(lockedRoll)
      return
    }
    setSelectedRoll(value)
    setError("")
  }

  const getFileForRoll = (rollNumber: number) => {
    const cycle = ((rollNumber - 1) % 3) + 1
    const fileNames = ["Set A", "Set B", "Set C"]
    const downloadUrls = [
      "https://www.dropbox.com/scl/fi/pl5wksbeyvyoyqodosxg2/CS_Assignment_SetA.pdf?rlkey=jnz2nu84jhz8xk3s891rom0dj&st=bvw5o3iv&dl=1",
      "https://www.dropbox.com/scl/fi/m0f0l0ptfg8rodj3eyqgu/CS_Assignment_SetB.pdf?rlkey=8ylw47hruore6faer9rfe3xhi&st=a2x2xnm6&dl=1",
      "https://www.dropbox.com/scl/fi/x8j8jsghuebdkov5fowmq/CS_Assignment_SetC.pdf?rlkey=nyxnmqsfjx5ksxptl6r3g341t&st=dfhytda0&dl=1",
    ]
    return {
      file: `${fileNames[cycle - 1]}.pdf`,
      url: downloadUrls[cycle - 1],
      cycle,
    }
  }

  const handleDownload = async () => {
    if (!selectedRoll) {
      setError("Please select your roll number")
      return
    }

    setIsLoading(true)
    setError("")
    setDownloadMessage(null)

    try {
      const rollNumber = Number.parseInt(selectedRoll)
      const { file, url } = getFileForRoll(rollNumber)

      if (!lockedRoll) {
        document.cookie = `lockedRoll=${selectedRoll}; path=/; max-age=${365 * 24 * 60 * 60}`
        setLockedRoll(selectedRoll)
      }

      await fetch("/api/track-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber }),
      })

      const link = document.createElement("a")
      link.href = url
      link.download = file
      link.setAttribute("target", "_blank")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setDownloadMessage({
        type: "success",
        text: "Download successful! Check your Downloads folder.",
      })
    } catch (err) {
      setDownloadMessage({
        type: "error",
        text: "Download failed. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isRollDisabled = (rollNum: string) => {
    return lockedRoll && lockedRoll !== rollNum
  }

  if (isAdminMode) {
    return <AdminPanel />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showModal && (
        <GuidesModal
          onClose={() => {
            setShowModal(false)
            setShowMainContent(true)
          }}
        />
      )}

      {/* Main Content */}
      <main
        className={`flex-1 max-w-2xl mx-auto w-full px-4 lg:px-6 py-12 transition-opacity duration-500 ${
          showMainContent ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Card
          className="p-8 border border-border/50 shadow-lg mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <div className="space-y-8">
            <div
              className="space-y-2 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <h1 className="text-4xl font-bold text-foreground">Assignment File Distribution</h1>
              <p className="text-lg text-muted-foreground">
                Select your roll number to download your assigned assignment file
              </p>
            </div>

            <div
              className="space-y-4 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <label className="block">
                <span className="text-sm font-semibold text-foreground mb-2 block">Your Roll Number</span>
                <Select value={selectedRoll} onValueChange={handleRollSelect}>
                  <SelectTrigger className="w-full h-12 text-base border border-border/50 hover:border-foreground/20 transition-colors">
                    <SelectValue placeholder="Select your roll number (01-50)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {Array.from({ length: 50 }, (_, i) => {
                      const rollNum = String(i + 1).padStart(2, "0")
                      const isDisabled = isRollDisabled(rollNum)
                      return (
                        <SelectItem key={rollNum} value={rollNum} disabled={isDisabled}>
                          <div className="flex items-center gap-2">
                            <span>{rollNum}</span>
                            {isDisabled && <Lock className="w-4 h-4" />}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </label>

              {lockedRoll && (
                <div
                  className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg border border-border/50 opacity-0 animate-fade-in"
                  style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
                >
                  <Lock className="w-5 h-5 text-foreground/60 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Session Locked</p>
                    <p className="text-sm text-muted-foreground">
                      Your session is locked to roll number {lockedRoll}. You can only download the file associated with
                      this roll number.{" "}
                      <a href="?reset=true" className="underline hover:no-underline font-medium text-foreground/80">
                        Request a second chance?
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <Alert
                variant="destructive"
                className="border opacity-0 animate-fade-in"
                style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {downloadMessage && (
              <Alert
                className={`border opacity-0 animate-fade-in ${
                  downloadMessage.type === "success"
                    ? "border-green-300 bg-green-50 text-green-900"
                    : "border-red-300 bg-red-50 text-red-900"
                }`}
                style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
              >
                <AlertDescription className={downloadMessage.type === "success" ? "text-green-800" : "text-red-800"}>
                  {downloadMessage.text}
                </AlertDescription>
              </Alert>
            )}

            <div
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
              <div className="relative inline-block w-full">
                <div className="absolute inset-0 bg-black/20 blur-xl rounded-lg opacity-0 group-hover:opacity-30 transition-opacity" />
                <Button
                  onClick={handleDownload}
                  disabled={!selectedRoll || isLoading}
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-black hover:bg-black/90 text-white transition-all duration-300 active:scale-95 relative"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Download Assignment File
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card
          className="p-8 border border-border/50 shadow-lg opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
        >
          <div className="space-y-6">
            <div
              className="space-y-2 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
              <h2 className="text-2xl font-bold text-foreground">Submission Format & Required Attachments</h2>
              <p className="text-muted-foreground">Please follow these guidelines for your submission</p>
            </div>

            <div
              className="space-y-4 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Printing & Binding</h3>
                <p className="text-sm text-muted-foreground">
                  Once downloaded, print the assignment file and submit it in a spiral-bound format to your teacher.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Required Attachments</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Your submission must include the following components attached to the top of your bound assignment,
                  exactly as provided by your class teacher:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                  <li>Cover Page</li>
                  <li>Certificate</li>
                  <li>Acknowledgment Page</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Code2 className="w-4 h-4 text-foreground/60" />
            Made with passion by <span className="font-semibold text-foreground">Adish Sagarawat</span>.
          </p>
        </div>
      </footer>
    </div>
  )
}
