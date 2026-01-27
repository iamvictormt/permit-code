"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Shield } from "lucide-react"
import Link from "next/link"

type DocumentType = "passport" | "national_id" | "biometric_card" | "customer_number"

interface DateOfBirth {
  day: string
  month: string
  year: string
}

interface DateErrors {
  day?: string
  month?: string
  year?: string
}

const validateDate = (dob: DateOfBirth): DateErrors => {
  const errors: DateErrors = {}
  const day = parseInt(dob.day, 10)
  const month = parseInt(dob.month, 10)
  const year = parseInt(dob.year, 10)
  const currentYear = new Date().getFullYear()

  if (!dob.day) {
    errors.day = "Enter day"
  } else if (isNaN(day) || day < 1 || day > 31) {
    errors.day = "Day must be between 1 and 31"
  }

  if (!dob.month) {
    errors.month = "Enter month"
  } else if (isNaN(month) || month < 1 || month > 12) {
    errors.month = "Month must be between 1 and 12"
  }

  if (!dob.year) {
    errors.year = "Enter year"
  } else if (isNaN(year) || dob.year.length !== 4) {
    errors.year = "Year must be 4 digits"
  } else if (year < 1900) {
    errors.year = "Year must be after 1900"
  } else if (year > currentYear) {
    errors.year = "Year cannot be in the future"
  }

  if (!errors.day && !errors.month && !errors.year) {
    const daysInMonth = new Date(year, month, 0).getDate()
    if (day > daysInMonth) {
      errors.day = `Day must be between 1 and ${daysInMonth} for this month`
    }

    const inputDate = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (inputDate > today) {
      errors.day = "Date of birth cannot be in the future"
    }

    const minAgeDate = new Date()
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 16)
    if (inputDate > minAgeDate) {
      errors.year = "You must be at least 16 years old"
    }
  }

  return errors
}

export default function LoginPage() {
  const [step, setStep] = useState<"document" | "document_number" | "date_of_birth">("document")
  const [documentType, setDocumentType] = useState<DocumentType | "">("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<DateOfBirth>({ day: "", month: "", year: "" })
  const [dateErrors, setDateErrors] = useState<DateErrors>({})
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleContinueToDocumentNumber = () => {
    if (!documentType) {
      setError("Please select a document type")
      return
    }
    setError("")
    setStep("document_number")
  }

  const handleContinueToDateOfBirth = () => {
    if (!documentNumber) {
      setError("Please enter your document number")
      return
    }
    setError("")
    setStep("date_of_birth")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDateErrors({})

    const errors = validateDate(dateOfBirth)
    if (Object.keys(errors).length > 0) {
      setDateErrors(errors)
      return
    }

    const result = await login("admin@empresa.com", "admin123")
    
    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Login failed")
    }
  }

  const handleDateChange = (field: keyof DateOfBirth, value: string) => {
    const numericValue = value.replace(/\D/g, "")
    
    let limitedValue = numericValue
    if (field === "day" || field === "month") {
      limitedValue = numericValue.slice(0, 2)
    } else if (field === "year") {
      limitedValue = numericValue.slice(0, 4)
    }

    setDateOfBirth(prev => ({ ...prev, [field]: limitedValue }))
    
    if (dateErrors[field]) {
      setDateErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const getDocumentTitle = () => {
    switch (documentType) {
      case "passport":
        return "What is your passport number?"
      case "national_id":
        return "What is your national identity card number?"
      case "biometric_card":
        return "What is your biometric residence card or permit number?"
      case "customer_number":
        return "What is your UKVI customer number?"
      default:
        return "What is your document number?"
    }
  }

  const getDocumentLabel = () => {
    switch (documentType) {
      case "passport":
        return "Passport number"
      case "national_id":
        return "National identity card number"
      case "biometric_card":
        return "Biometric residence card or permit number"
      case "customer_number":
        return "Customer number"
      default:
        return "Document number"
    }
  }

  const getDocumentExample = () => {
    switch (documentType) {
      case "passport":
        return "For example, 120382978"
      case "national_id":
        return "For example, AB123456"
      case "biometric_card":
        return "For example, ZU1234567"
      case "customer_number":
        return ""
      default:
        return "Enter your document number"
    }
  }

  const getHelpLink = () => {
    switch (documentType) {
      case "passport":
        return "I do not know my passport number"
      case "national_id":
        return "I do not know my national identity card number"
      case "biometric_card":
        return "I do not know my biometric residence card or permit number"
      case "customer_number":
        return "I do not know my UKVI customer number"
      default:
        return "I do not know my document number"
    }
  }

  // Biometric card illustration component
  const BiometricCardIllustration = () => (
    <div className="mb-8 relative">
      {/* Card illustration */}
      <div className="relative w-full max-w-[280px]">
        {/* The card */}
        <svg viewBox="0 0 320 200" className="w-full h-auto">
          {/* Card background with gradient */}
          <defs>
            <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D8B7A" />
              <stop offset="50%" stopColor="#E8B4D0" />
              <stop offset="100%" stopColor="#2D8B7A" />
            </linearGradient>
          </defs>
          <rect x="0" y="20" width="240" height="150" rx="8" fill="url(#cardGradient)" />
          
          {/* Card header stripe */}
          <rect x="0" y="20" width="240" height="25" rx="8" fill="#1a5c4e" />
          <rect x="0" y="37" width="240" height="8" fill="#1a5c4e" />
          
          {/* White stripes on header */}
          <rect x="60" y="28" width="80" height="4" fill="white" opacity="0.8" />
          <rect x="60" y="35" width="50" height="4" fill="white" opacity="0.6" />
          
          {/* Document number on card */}
          <text x="145" y="58" fontSize="10" fill="#333" fontFamily="monospace">ZU1234567</text>
          
          {/* Photo placeholder */}
          <rect x="15" y="55" width="55" height="70" fill="#d1d5db" />
          <circle cx="42" cy="80" r="15" fill="#9ca3af" />
          <ellipse cx="42" cy="105" rx="20" ry="12" fill="#9ca3af" />
          
          {/* UK coat of arms area */}
          <circle cx="180" cy="100" r="35" fill="#E8B4D0" opacity="0.5" />
          <text x="168" y="105" fontSize="24" fill="#9f1239" opacity="0.6">&#9827;</text>
          
          {/* Signature line */}
          <path d="M 85 145 Q 100 135, 120 145 T 160 145" stroke="#666" strokeWidth="1" fill="none" />
        </svg>
        
        {/* Zoom circle pointing to document number */}
        <div className="absolute -top-2 -right-4 w-24 h-24 rounded-full bg-[#f8d4e0] border-2 border-[#e9a8c4] flex items-center justify-center">
          <span className="text-sm font-mono font-medium text-foreground">ZU1234567</span>
        </div>
        
        {/* Line connecting zoom to card */}
        <svg className="absolute top-6 right-12 w-12 h-8" viewBox="0 0 50 30">
          <line x1="0" y1="30" x2="50" y2="0" stroke="#e9a8c4" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )

  

  // Branding component
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

  // Step 3: Date of Birth
  if (step === "date_of_birth") {
    return (
      <main className="min-h-screen bg-background">
        <div className="min-h-screen flex">
          <Branding />
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              <MobileHeader />

              <p className="text-muted-foreground mb-2">Sign in</p>
              <h1 className="text-2xl font-bold text-foreground mb-6 text-balance">
                What is your date of birth?
              </h1>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Date of birth
                  </Label>
                  <p className="text-sm text-muted-foreground">For example, 31 03 1990</p>
                  <div className="flex gap-3 mt-4">
                    <div className="space-y-1">
                      <Label htmlFor="day" className="text-xs text-muted-foreground">Day</Label>
                      <Input
                        id="day"
                        type="text"
                        inputMode="numeric"
                        placeholder="DD"
                        value={dateOfBirth.day}
                        onChange={(e) => handleDateChange("day", e.target.value)}
                        disabled={isLoading}
                        className={`h-12 w-20 text-center text-lg border-2 ${dateErrors.day ? "border-destructive focus-visible:ring-destructive" : "border-foreground"}`}
                        maxLength={2}
                      />
                      {dateErrors.day && (
                        <p className="text-xs text-destructive max-w-20">{dateErrors.day}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="month" className="text-xs text-muted-foreground">Month</Label>
                      <Input
                        id="month"
                        type="text"
                        inputMode="numeric"
                        placeholder="MM"
                        value={dateOfBirth.month}
                        onChange={(e) => handleDateChange("month", e.target.value)}
                        disabled={isLoading}
                        className={`h-12 w-20 text-center text-lg border-2 ${dateErrors.month ? "border-destructive focus-visible:ring-destructive" : "border-foreground"}`}
                        maxLength={2}
                      />
                      {dateErrors.month && (
                        <p className="text-xs text-destructive max-w-20">{dateErrors.month}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="year" className="text-xs text-muted-foreground">Year</Label>
                      <Input
                        id="year"
                        type="text"
                        inputMode="numeric"
                        placeholder="YYYY"
                        value={dateOfBirth.year}
                        onChange={(e) => handleDateChange("year", e.target.value)}
                        disabled={isLoading}
                        className={`h-12 w-24 text-center text-lg border-2 ${dateErrors.year ? "border-destructive focus-visible:ring-destructive" : "border-foreground"}`}
                        maxLength={4}
                      />
                      {dateErrors.year && (
                        <p className="text-xs text-destructive max-w-24">{dateErrors.year}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setStep("document_number")}
                  className="text-primary hover:underline text-sm"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Step 2: Document Number
  if (step === "document_number") {
    return (
      <main className="min-h-screen bg-background">
        <div className="min-h-screen flex">
          <Branding />
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              <MobileHeader />

              <p className="text-muted-foreground mb-2">Sign in</p>
              <h1 className="text-2xl font-bold text-foreground mb-8 text-balance">
                {getDocumentTitle()}
              </h1>

              {documentType === "biometric_card" && <BiometricCardIllustration />}

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                {documentType === "customer_number" ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      You will have a UKVI customer number if you did not use an identity document to create your account.
                    </p>
                    <p className="text-sm text-foreground">
                      Your UKVI customer number is 10 characters long and starts with KX, for example KX12345678.
                    </p>
                    <div className="flex">
                      <div className="flex items-center justify-center px-3 h-12 border-2 border-r-0 border-foreground bg-muted text-foreground font-medium">
                        KX
                      </div>
                      <Input
                        id="customerNumber"
                        type="text"
                        value={documentNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 8)
                          setDocumentNumber(value)
                        }}
                        disabled={isLoading}
                        placeholder=""
                        className="h-12 text-lg border-2 border-foreground rounded-l-none flex-1"
                        maxLength={8}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="documentNumber" className="text-sm font-medium text-foreground">
                      {getDocumentLabel()}
                    </Label>
                    <p className="text-sm text-muted-foreground">{getDocumentExample()}</p>
                    <Input
                      id="documentNumber"
                      type="text"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      disabled={isLoading}
                      className="h-12 text-lg border-2 border-foreground"
                    />
                  </div>
                )}

                <Button 
                  onClick={handleContinueToDateOfBirth}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continue
                </Button>

                <div>
                  <Link 
                    href="/login/recover" 
                    className="text-primary hover:underline text-sm"
                  >
                    {getHelpLink()}
                  </Link>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setStep("document")}
                    className="text-primary hover:underline text-sm"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Step 1: Document Selection
  return (
    <main className="min-h-screen bg-background">
      <div className="min-h-screen flex">
        <Branding />
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <MobileHeader />

            <p className="text-muted-foreground mb-2">Sign in</p>
            <h1 className="text-2xl font-bold text-foreground mb-6 text-balance">
              Which identity document do you use to sign in to your account?
            </h1>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              This is usually the document you used when you created your account. If you have added a new document to your account, use the most recent document to sign in.
            </p>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <RadioGroup
              value={documentType}
              onValueChange={(value) => {
                setDocumentType(value as DocumentType)
                setError("")
              }}
              className="space-y-4 mb-8"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem 
                  value="passport" 
                  id="passport"
                  className="h-5 w-5 border-2 border-foreground"
                />
                <Label htmlFor="passport" className="text-sm font-normal cursor-pointer">
                  Passport
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem 
                  value="national_id" 
                  id="national_id"
                  className="h-5 w-5 border-2 border-foreground"
                />
                <Label htmlFor="national_id" className="text-sm font-normal cursor-pointer">
                  National identity card
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <RadioGroupItem 
                  value="biometric_card" 
                  id="biometric_card"
                  className="h-5 w-5 border-2 border-foreground"
                />
                <Label htmlFor="biometric_card" className="text-sm font-normal cursor-pointer">
                  Biometric residence card or permit
                </Label>
              </div>

              <p className="text-muted-foreground text-sm py-1">or</p>

              <div className="flex items-center space-x-3">
                <RadioGroupItem 
                  value="customer_number" 
                  id="customer_number"
                  className="h-5 w-5 border-2 border-foreground"
                />
                <Label htmlFor="customer_number" className="text-sm font-normal cursor-pointer">
                  I use a customer number
                </Label>
              </div>
            </RadioGroup>

            <Button 
              onClick={handleContinueToDocumentNumber}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue
            </Button>

            <div className="mt-6">
              <Link 
                href="/login/recover" 
                className="text-primary hover:underline text-sm"
              >
                I do not know which identity document I use to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
