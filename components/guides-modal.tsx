"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface GuidesModalProps {
  onClose: () => void
}

export default function GuidesModal({ onClose }: GuidesModalProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleOkay = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in min-h-screen w-screen">
      <div
        className="w-full max-w-2xl mx-auto px-4 py-12 opacity-0 animate-slide-down transition-all duration-300 max-h-screen overflow-y-auto"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="bg-card border border-border/50 shadow-2xl rounded-lg p-8 space-y-6">
          <div
            className="space-y-2 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <h1 className="text-3xl font-bold text-foreground">Assignment Download Guidelines</h1>
            <p className="text-muted-foreground">Please read these important instructions before proceeding</p>
          </div>

          <div
            className="space-y-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            <div className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-foreground/60 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">How It Works</h3>
                  <p className="text-sm text-muted-foreground">
                    Select your unique roll number (01-50) to download your assigned assignment file. Each roll number
                    is mapped to a specific set.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-foreground/60 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Submission Format</h3>
                  <p className="text-sm text-muted-foreground">
                    Once downloaded, you must print the assignment file and submit it in a spiral-bound format to your
                    teacher.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-foreground/60 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Required Attachments</h3>
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
          </div>

          <div
            className="pt-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <div className="relative inline-block w-full">
              <div className="absolute inset-0 bg-black/20 blur-xl rounded-lg opacity-0 hover:opacity-30 transition-opacity" />
              <Button
                onClick={handleOkay}
                size="lg"
                className="w-full h-12 text-base font-semibold bg-black hover:bg-black/90 text-white transition-all duration-300 active:scale-95 relative"
              >
                Okay, I Understand
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}