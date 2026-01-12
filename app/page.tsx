import { Suspense } from "react"
import HomeContent from "@/components/home-content"

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomeContent />
    </Suspense>
  )
}
