import { AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function NoticeBox() {
  return (
    <Card className="border-2 border-amber-200 bg-amber-50 p-6 shadow-md">
      <div className="flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-3 flex-1">
          <h2 className="font-bold text-lg text-amber-900">Important: Submission Guidelines</h2>
          <div className="space-y-2 text-sm text-amber-800">
            <p>
              <span className="font-semibold">Platform Purpose:</span> This platform allows you to download your
              assigned project files based on your unique roll number.
            </p>
            <p>
              <span className="font-semibold">Submission Format:</span> Once downloaded, you must{" "}
              <strong>print the files and submit them in a spiral-bound format</strong> to your teacher.
            </p>
            <p>
              <span className="font-semibold">Required Attachments:</span> Your submission must include the following
              components attached to the top of your bound project, exactly as provided by your class teacher:
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Cover Page</li>
              <li>Certificate</li>
              <li>Acknowledgment Page</li>
            </ul>
            <p className="pt-1">Ensure all documents are properly organized and securely bound before submission.</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
