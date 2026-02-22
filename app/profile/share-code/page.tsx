"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Printer, Loader2 } from "lucide-react"
import Link from "next/link"
import { GovFooter } from "@/components/gov-footer"
import { useAuth } from "@/lib/auth-context"

export default function ShareCodePage() {
  const { user } = useAuth()
  const [shareCode, setShareCode] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user?.id) return

    const fetchShareCode = async () => {
      try {
        const response = await fetch('/api/auth/share-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        })
        const data = await response.json()
        if (response.ok) {
          setShareCode(data.shareCode)
          setExpiryDate(new Date(data.expiresAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }))
        } else {
          setError(data.error || "Failed to fetch share code")
        }
      } catch (err) {
        setError("An error occurred while fetching the share code")
      } finally {
        setLoading(false)
      }
    }

    fetchShareCode()
  }, [user?.id])

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Back Link */}
          <Link 
            href="/profile" 
            className="inline-flex items-center text-primary hover:underline mb-8"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>

          <h1 className="text-2xl font-bold text-foreground mb-8">
            Details to give your employer
          </h1>

          {/* Share Code Section */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-2">Share code</p>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Fetching share code...</span>
              </div>
            ) : error ? (
              <p className="text-destructive font-bold py-4">{error}</p>
            ) : (
              <>
                <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-wide mb-4">
                  {shareCode}
                </p>

                {/* Validity Notice */}
                <div className="border-l-4 border-muted-foreground bg-muted/30 pl-4 py-3">
                  <p className="text-foreground">
                    This code is valid until {expiryDate}.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* What to do next */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">What to do next</h2>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <p className="text-foreground pt-1">
                  Give the share code and your date of birth to the person you want to prove your right to work to.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <p className="text-foreground pt-1">
                  To see your right to work, they must enter the share code and your date of birth at{" "}
                  <span className="text-primary hover:underline cursor-pointer">
                    www.gov.uk/view-right-to-work
                  </span>
                  .
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <p className="text-foreground pt-1">
                  Contact them to make sure they have all the information they need.
                </p>
              </div>
            </div>
          </div>

          {/* Print Link */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Printer className="w-5 h-5" />
            Print this page
          </button>
        </div>
      </div>
      <GovFooter />
    </main>
  )
}
