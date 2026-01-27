"use client"

import { useState } from "react"
import { ChevronLeft, Printer } from "lucide-react"
import Link from "next/link"
import { GovFooter } from "@/components/gov-footer"

export default function ShareCodePage() {
  const [shareCode] = useState<string>(() => {
    // Generate a random share code in format XXX XXX XXX
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let code = ""
    for (let i = 0; i < 9; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return `${code.slice(0, 3)} ${code.slice(3, 6)} ${code.slice(6, 9)}`
  })

  // Calculate expiry date (30 days from now)
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30)
  const formattedExpiry = expiryDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

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
            <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-wide mb-4">
              {shareCode}
            </p>
            
            {/* Validity Notice */}
            <div className="border-l-4 border-muted-foreground bg-muted/30 pl-4 py-3">
              <p className="text-foreground">
                This code is valid until {formattedExpiry}.
              </p>
            </div>
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
