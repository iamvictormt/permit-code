"use client"

import { useState, useEffect } from "react"
import { Printer, Loader2 } from "lucide-react"
import Link from "next/link"
import { GovFooter } from "@/components/gov-footer"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { GovHeader } from "@/components/gov-header"
import { BetaBanner } from "@/components/beta-banner"

export default function ShareCodePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [shareCode, setShareCode] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

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
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <BetaBanner />
      <main className="flex-1 max-w-[960px] mx-auto w-full px-4 py-8">
        <div className="max-w-[640px]">
          {/* Back Link */}
          <Link 
            href="/profile" 
            className="text-govuk-black underline hover:decoration-3 mb-8 flex items-center gap-1 text-xl cursor-pointer"
          >
            <span className="inline-block border-l-2 border-b-2 border-current w-2.5 h-2.5 rotate-45 mr-1 mb-0.5"></span>
            Back
          </Link>

          <h1 className="text-4xl font-bold mb-10">
            Details to give your employer
          </h1>

          {/* Share Code Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-govuk-black mb-4">Share code</h2>
            {loading ? (
              <div className="flex items-center gap-2 text-govuk-grey-1 py-4">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xl">Fetching share code...</span>
              </div>
            ) : error ? (
              <p className="text-destructive font-bold py-4 text-xl">{error}</p>
            ) : (
              <>
                <p className="text-5xl sm:text-6xl font-bold text-govuk-black tracking-tight mb-8">
                  {shareCode}
                </p>

                {/* Validity Notice */}
                <div className="border-l-[10px] border-govuk-grey-2 bg-govuk-grey-3 pl-4 py-4 mb-10">
                  <p className="text-xl mb-0">
                    This code is valid until <span className="font-bold">{expiryDate}</span>.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* What to do next */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-govuk-black mb-6">What to do next</h2>
            
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-govuk-black text-white flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <p className="text-xl text-govuk-black pt-1">
                  Give the share code and your date of birth to the person you want to prove your right to work to.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-govuk-black text-white flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <p className="text-xl text-govuk-black pt-1">
                  To see your right to work, they must enter the share code and your date of birth at{" "}
                  <button className="text-govuk-blue underline hover:decoration-3">
                    www.gov.uk/view-right-to-work
                  </button>
                  .
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-govuk-black text-white flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <p className="text-xl text-govuk-black pt-1">
                  Contact them to make sure they have all the information they need.
                </p>
              </div>
            </div>
          </div>

          {/* Print Link */}
          <div className="pt-8 border-t-[1px] border-govuk-grey-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-3 text-govuk-blue underline hover:decoration-3 text-xl"
            >
              <Printer className="w-6 h-6" />
              Print this page
            </button>
          </div>
        </div>
      </main>
      <GovFooter />
    </div>
  )
}
