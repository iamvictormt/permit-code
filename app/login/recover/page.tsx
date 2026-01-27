"use client"

import Link from "next/link"
import { ChevronLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GovFooter } from "@/components/gov-footer"

export default function RecoverAccountPage() {
  // Branding component (same as login page)
  const Branding = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
      <div className="max-w-md text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/10 mx-auto mb-8">
          <Shield className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">
          PermitCode
        </h2>
        <p className="text-primary-foreground/80 text-lg">
          Work permit management system for secure verification and compliance tracking.
        </p>
      </div>
    </div>
  )

  // Mobile header component
  const MobileHeader = () => (
    <div className="lg:hidden flex items-center gap-3 mb-8">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
        <Shield className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className="font-bold text-xl text-foreground">PermitCode</span>
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      <div className="min-h-screen flex">
        <Branding />
        <div className="flex-1 flex items-start justify-center p-6 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-lg">
            <MobileHeader />

            {/* Back link */}
            <Link 
              href="/login" 
              className="inline-flex items-center text-foreground hover:underline mb-6"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Link>

            {/* Header */}
            <p className="text-muted-foreground mb-2">Recover account</p>
            <h1 className="text-2xl font-bold text-foreground mb-6 text-balance">
              Recover your UK Visas and Immigration (UKVI) account
            </h1>

            {/* When to use this service */}
            <p className="text-foreground mb-3">Use this service if:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-foreground">
              <li>you do not have access to the phone number and email address you use to sign in</li>
              <li>you do not know the identity document or UKVI customer number you use to sign in</li>
            </ul>

            {/* Reset phone and email section */}
            <h2 className="text-xl font-bold text-foreground mb-4">
              Reset the phone number and email address you use to sign in to your account
            </h2>
            
            <p className="text-foreground mb-3">Get back in to your account if:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground">
              <li>you do not have access to both the phone number and email address you use to sign in</li>
              <li>someone was managing your account for you, but you now want to manage it yourself</li>
            </ul>

            <p className="text-foreground mb-3">You will need:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-foreground">
              <li>details of the identity document you use to sign in to your account (your passport, national identity card, or biometric residence card or permit)</li>
              <li>your date of birth</li>
              <li>access to a new phone number and email address to sign in to your account</li>
            </ul>

            {/* Get reminder section */}
            <h2 className="text-xl font-bold text-foreground mb-4">
              Get a reminder of the identity document or UKVI customer number you use to sign in to your account
            </h2>

            <p className="text-foreground mb-3">You will need:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground">
              <li>access to the phone number and email address you use to sign in to your account</li>
              <li>your date of birth</li>
            </ul>

            <p className="text-foreground italic mb-4">
              If you are helping someone else, use their details, not yours.
            </p>

            <p className="text-foreground mb-6">
              You can still recover your account if you do not have all of this information.
            </p>

            {/* Start button */}
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground mb-8"
              asChild
            >
              <Link href="/login/recover/start">
                Start
              </Link>
            </Button>

            {/* Contact section */}
            <h2 className="text-xl font-bold text-foreground mb-4">
              Contact UKVI to recover your account
            </h2>
            <p className="text-foreground">
              If you cannot recover your account,{" "}
              <span className="text-primary hover:underline cursor-pointer">
                contact UKVI for help
              </span>
              .
            </p>
          </div>
        </div>
      </div>
      <GovFooter />
    </main>
  )
}
