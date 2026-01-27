'use client';

import React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { GovFooter } from '@/components/gov-footer';
import Image from 'next/image';

type DocumentType = 'passport' | 'national_id' | 'biometric_card' | 'customer_number';

interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}

interface DateErrors {
  day?: string;
  month?: string;
  year?: string;
}

const validateDate = (dob: DateOfBirth): DateErrors => {
  const errors: DateErrors = {};
  const day = parseInt(dob.day, 10);
  const month = parseInt(dob.month, 10);
  const year = parseInt(dob.year, 10);
  const currentYear = new Date().getFullYear();

  if (!dob.day) {
    errors.day = 'Enter day';
  } else if (isNaN(day) || day < 1 || day > 31) {
    errors.day = 'Day must be between 1 and 31';
  }

  if (!dob.month) {
    errors.month = 'Enter month';
  } else if (isNaN(month) || month < 1 || month > 12) {
    errors.month = 'Month must be between 1 and 12';
  }

  if (!dob.year) {
    errors.year = 'Enter year';
  } else if (isNaN(year) || dob.year.length !== 4) {
    errors.year = 'Year must be 4 digits';
  } else if (year < 1900) {
    errors.year = 'Year must be after 1900';
  } else if (year > currentYear) {
    errors.year = 'Year cannot be in the future';
  }

  if (!errors.day && !errors.month && !errors.year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      errors.day = `Day must be between 1 and ${daysInMonth} for this month`;
    }

    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate > today) {
      errors.day = 'Date of birth cannot be in the future';
    }

    const minAgeDate = new Date();
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 16);
    if (inputDate > minAgeDate) {
      errors.year = 'You must be at least 16 years old';
    }
  }

  return errors;
};

type SecurityCodeMethod = 'sms' | 'email';

export default function LoginPage() {
  const [step, setStep] = useState<'document' | 'document_number' | 'date_of_birth' | 'security_code' | 'verify_code'>(
    'document',
  );
  const [documentType, setDocumentType] = useState<DocumentType | ''>('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<DateOfBirth>({ day: '', month: '', year: '' });
  const [dateErrors, setDateErrors] = useState<DateErrors>({});
  const [securityCodeMethod, setSecurityCodeMethod] = useState<SecurityCodeMethod | ''>('');
  const [securityCode, setSecurityCode] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleContinueToDocumentNumber = () => {
    if (!documentType) {
      setError('Please select a document type');
      return;
    }
    setError('');
    setStep('document_number');
  };

  const handleContinueToDateOfBirth = () => {
    if (!documentNumber) {
      setError('Please enter your document number');
      return;
    }
    setError('');
    setStep('date_of_birth');
  };

  const handleContinueToSecurityCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDateErrors({});

    const errors = validateDate(dateOfBirth);
    if (Object.keys(errors).length > 0) {
      setDateErrors(errors);
      return;
    }

    setStep('security_code');
  };

  const handleContinueToVerifyCode = () => {
    if (!securityCodeMethod) {
      setError('Please select how you want to receive your security code');
      return;
    }
    setError('');
    setStep('verify_code');
  };

  const handleVerifyCode = async () => {
    if (!securityCode || securityCode.length !== 6) {
      setError('Please enter the 6-digit security code');
      return;
    }

    const result = await login('admin@empresa.com', 'admin123');

    if (result.success) {
      router.push('/profile');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleDateChange = (field: keyof DateOfBirth, value: string) => {
    const numericValue = value.replace(/\D/g, '');

    let limitedValue = numericValue;
    if (field === 'day' || field === 'month') {
      limitedValue = numericValue.slice(0, 2);
    } else if (field === 'year') {
      limitedValue = numericValue.slice(0, 4);
    }

    setDateOfBirth((prev) => ({ ...prev, [field]: limitedValue }));

    if (dateErrors[field]) {
      setDateErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    // Placeholder for handleSubmit logic
  };

  const getDocumentTitle = () => {
    switch (documentType) {
      case 'passport':
        return 'What is your passport number?';
      case 'national_id':
        return 'What is your national identity card number?';
      case 'biometric_card':
        return 'What is your biometric residence card or permit number?';
      case 'customer_number':
        return 'What is your UKVI customer number?';
      default:
        return 'What is your document number?';
    }
  };

  const getDocumentLabel = () => {
    switch (documentType) {
      case 'passport':
        return 'Passport number';
      case 'national_id':
        return 'National identity card number';
      case 'biometric_card':
        return 'Biometric residence card or permit number';
      case 'customer_number':
        return 'Customer number';
      default:
        return 'Document number';
    }
  };

  const getDocumentExample = () => {
    switch (documentType) {
      case 'passport':
        return 'For example, 120382978';
      case 'national_id':
        return 'For example, AB123456';
      case 'biometric_card':
        return 'For example, ZU1234567';
      case 'customer_number':
        return '';
      default:
        return 'Enter your document number';
    }
  };

  const getHelpLink = () => {
    switch (documentType) {
      case 'passport':
        return 'I do not know my passport number';
      case 'national_id':
        return 'I do not know my national identity card number';
      case 'biometric_card':
        return 'I do not know my biometric residence card or permit number';
      case 'customer_number':
        return 'I do not know my UKVI customer number';
      default:
        return 'I do not know my document number';
    }
  };

  // Branding component
  const Branding = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
      <div className="max-w-md text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/10 mx-auto mb-8">
          <Shield className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">PermitCode</h2>
        <p className="text-primary-foreground/80 text-lg">
          Work permit management system for secure verification and compliance tracking.
        </p>
      </div>
    </div>
  );

  // Mobile header component
  const MobileHeader = () => (
    <div className="lg:hidden flex items-center gap-3 mb-8">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
        <Shield className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className="font-bold text-xl text-foreground">PermitCode</span>
    </div>
  );

  // Step 5: Verify Security Code
  if (step === 'verify_code') {
    const maskedContact = securityCodeMethod === 'email' ? 'v***********p@gmail.com' : '075*****886';
    const contactType = securityCodeMethod === 'email' ? 'email' : 'text message';
    const alternativeMethod = securityCodeMethod === 'email' ? 'phone number' : 'email address';

    return (
      <main className="min-h-screen bg-background">
        <div className="min-h-screen flex">
          <Branding />
          <div className="flex-1 flex items-center justify-center p-6 g:p-12">
            <div className="w-full max-w-lg">
              <MobileHeader />

              <button
                type="button"
                onClick={() => setStep('security_code')}
                className="text-primary hover:underline text-sm mb-6 flex items-center gap-1"
              >
                <span>&lt;</span> Back
              </button>

              <p className="text-muted-foreground mb-2">Sign in</p>
              <h1 className="text-2xl font-bold text-foreground mb-6 text-balance">
                Check your {securityCodeMethod === 'email' ? 'email' : 'phone'}
              </h1>

              <p className="text-muted-foreground mb-2">
                We have sent you a single-use, 6-digit security code by {contactType} to:
              </p>
              <p className="font-semibold text-foreground mb-4">{maskedContact}</p>
              <p className="text-muted-foreground mb-6 text-sm">
                It may take a few minutes to arrive. You need to use this code within 10 minutes or it will expire.
              </p>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="securityCode" className="text-sm font-medium text-foreground">
                    Security code
                  </Label>
                  <Input
                    id="securityCode"
                    type="text"
                    inputMode="numeric"
                    value={securityCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setSecurityCode(value);
                      setError('');
                    }}
                    disabled={isLoading}
                    className="h-12 text-lg border-2 border-foreground"
                    maxLength={6}
                  />
                </div>

                <Button
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>

                <button
                  type="button"
                  className="text-primary hover:underline text-sm"
                  onClick={() => {
                    // In a real app, this would resend the code
                    setError('');
                  }}
                >
                  Resend security code
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h2 className="text-lg font-semibold text-foreground mb-3">Problems signing in</h2>
                <p className="text-muted-foreground mb-3">
                  If you do not have access to this {securityCodeMethod === 'email' ? 'email address' : 'phone number'},{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSecurityCodeMethod(securityCodeMethod === 'email' ? 'sms' : 'email');
                      setStep('security_code');
                    }}
                    className="text-primary hover:underline"
                  >
                    use your {alternativeMethod} instead
                  </button>
                  .
                </p>
                <p className="text-muted-foreground">
                  If you do not have access to your phone number and email address,{' '}
                  <Link href="/login/recover" className="text-primary hover:underline">
                    recover your account
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
        <GovFooter />
      </main>
    );
  }

  // Step 4: Security Code Method
  if (step === 'security_code') {
    return (
      <main className="min-h-screen bg-background">
        <div className="min-h-screen flex">
          <Branding />
          <div className="flex-1 flex items-center justify-center p-6 g:p-12">
            <div className="w-full max-w-lg">
              <MobileHeader />
              <button
                type="button"
                onClick={() => setStep('date_of_birth')}
                className="text-primary hover:underline text-sm mb-6 flex items-center gap-1"
              >
                <span>&lt;</span> Back
              </button>
              <p className="text-muted-foreground mb-2">Sign in</p>
              <h1 className="text-2xl font-bold text-foreground mb-8 text-balance">
                How do you want to receive a security code?
              </h1>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <RadioGroup
                value={securityCodeMethod}
                onValueChange={(value) => {
                  setSecurityCodeMethod(value as SecurityCodeMethod);
                  setError('');
                }}
                className="space-y-6 mb-8"
              >
                <div className="flex gap-4 items-start sm:items-center">
                  <RadioGroupItem
                    value="sms"
                    id="sms"
                    className="h-9 w-9 border-2 border-foreground shrink-0 sm:mt-0 mt-1"
                  />

                  <Label htmlFor="sms" className="text-lg font-normal cursor-pointer leading-snug block w-full">
                    <span className="block sm:inline">Send a text message (SMS) to </span>
                    <span className="block sm:inline font-medium">075*****886</span>
                  </Label>
                </div>

                <div className="flex gap-4 items-start sm:items-center">
                  <RadioGroupItem
                    value="email"
                    id="email"
                    className="h-9 w-9 border-2 border-foreground shrink-0 sm:mt-0 mt-1"
                  />

                  <Label htmlFor="email" className="text-lg font-normal cursor-pointer leading-snug block w-full">
                    <span className="block sm:inline">Send an email to </span>
                    <span className="block sm:inline font-medium break-words">v***********p@gmail.com</span>
                  </Label>
                </div>
              </RadioGroup>

              <Button
                onClick={handleContinueToVerifyCode}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Continue
              </Button>

              <div className="mt-8 pt-6 border-t border-border">
                <h2 className="text-lg font-semibold text-foreground mb-3">Problems signing in</h2>
                <p className="text-muted-foreground">
                  If you do not have access to the phone number and email address,{' '}
                  <Link href="/login/recover" className="text-primary hover:underline">
                    recover your account
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
        <GovFooter />
      </main>
    );
  }

  // Step 3: Date of Birth
  if (step === 'date_of_birth') {
    return (
      <main className="min-h-screen bg-background">
        <div className="min-h-screen flex">
          <Branding />
          <div className="flex-1 flex items-center justify-center p-6 g:p-12">
            <div className="w-full max-w-lg">
              <MobileHeader />
              <button
                type="button"
                onClick={() => setStep('document_number')}
                className="text-primary hover:underline text-sm mb-6 flex items-center gap-1"
              >
                <span>&lt;</span> Back
              </button>
              <p className="text-muted-foreground mb-2">Sign in</p>
              <h1 className="text-2xl font-bold text-foreground mb-6 text-balance">What is your date of birth?</h1>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleContinueToSecurityCode} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Date of birth</Label>
                  <p className="text-sm text-muted-foreground">For example, 31 03 1990</p>
                  <div className="flex gap-3 mt-4">
                    <div className="space-y-1">
                      <Label htmlFor="day" className="text-xs text-muted-foreground">
                        Day
                      </Label>
                      <Input
                        id="day"
                        type="text"
                        inputMode="numeric"
                        placeholder="DD"
                        value={dateOfBirth.day}
                        onChange={(e) => handleDateChange('day', e.target.value)}
                        disabled={isLoading}
                        className={`h-12 w-20 text-center text-lg border-2 ${dateErrors.day ? 'border-destructive focus-visible:ring-destructive' : 'border-foreground'}`}
                        maxLength={2}
                      />
                      {dateErrors.day && <p className="text-xs text-destructive max-w-20">{dateErrors.day}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="month" className="text-xs text-muted-foreground">
                        Month
                      </Label>
                      <Input
                        id="month"
                        type="text"
                        inputMode="numeric"
                        placeholder="MM"
                        value={dateOfBirth.month}
                        onChange={(e) => handleDateChange('month', e.target.value)}
                        disabled={isLoading}
                        className={`h-12 w-20 text-center text-lg border-2 ${dateErrors.month ? 'border-destructive focus-visible:ring-destructive' : 'border-foreground'}`}
                        maxLength={2}
                      />
                      {dateErrors.month && <p className="text-xs text-destructive max-w-20">{dateErrors.month}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="year" className="text-xs text-muted-foreground">
                        Year
                      </Label>
                      <Input
                        id="year"
                        type="text"
                        inputMode="numeric"
                        placeholder="YYYY"
                        value={dateOfBirth.year}
                        onChange={(e) => handleDateChange('year', e.target.value)}
                        disabled={isLoading}
                        className={`h-12 w-24 text-center text-lg border-2 ${dateErrors.year ? 'border-destructive focus-visible:ring-destructive' : 'border-foreground'}`}
                        maxLength={4}
                      />
                      {dateErrors.year && <p className="text-xs text-destructive max-w-24">{dateErrors.year}</p>}
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
                    'Continue'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
        <GovFooter />
      </main>
    );
  }

  // Step 2: Document Number
  if (step === 'document_number') {
    return (
      <main className="min-h-screen bg-background">
        <div className="min-h-screen flex">
          <Branding />
          <div className="flex-1 flex items-center justify-center p-6 g:p-12">
            <div className="w-full max-w-lg">
              <MobileHeader />
              <button
                type="button"
                onClick={() => setStep('document')}
                className="text-primary hover:underline text-sm mb-6 flex items-center gap-1"
              >
                <span>&lt;</span> Back
              </button>
              <p className="text-muted-foreground mb-2">Sign in</p>
              <h1 className="text-2xl font-bold text-foreground mb-4 text-balance">{getDocumentTitle()}</h1>

              {documentType === 'biometric_card' && (
                <Image src="/permit-number.png" alt="Biometric Card" width={360} height={360} />
              )}

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                {documentType === 'customer_number' ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      You will have a UKVI customer number if you did not use an identity document to create your
                      account.
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
                          const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                          setDocumentNumber(value);
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
                  <Link href="/login/recover" className="text-primary hover:underline text-sm">
                    {getHelpLink()}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <GovFooter />
      </main>
    );
  }

  // Step 1: Document Selection
  return (
    <main className="min-h-screen bg-background">
      <div className="min-h-screen flex">
        <Branding />
        <div className="flex-1 flex items-center justify-center p-6 g:p-12">
          <div className="w-full max-w-lg">
            <MobileHeader />

            <p className="text-muted-foreground mb-2">Sign in</p>
            <h1 className="text-2xl font-bold text-foreground mb-6 text-balance">
              Which identity document do you use to sign in to your account?
            </h1>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              This is usually the document you used when you created your account. If you have added a new document to
              your account, use the most recent document to sign in.
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
                setDocumentType(value as DocumentType);
                setError('');
              }}
              className="space-y-5 mb-8"
            >
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="passport" id="passport" className="h-9 w-9 border-2 border-foreground" />
                <Label htmlFor="passport" className="text-lg font-normal cursor-pointer">
                  Passport
                </Label>
              </div>

              <div className="flex items-center space-x-4">
                <RadioGroupItem value="national_id" id="national_id" className="h-9 w-9 border-2 border-foreground" />
                <Label htmlFor="national_id" className="text-lg font-normal cursor-pointer">
                  National identity card
                </Label>
              </div>

              <div className="flex items-center space-x-4">
                <RadioGroupItem
                  value="biometric_card"
                  id="biometric_card"
                  className="h-9 w-9 border-2 border-foreground"
                />
                <Label htmlFor="biometric_card" className="text-lg font-normal cursor-pointer">
                  Biometric residence card or permit
                </Label>
              </div>

              <p className="text-muted-foreground text-base py-1">or</p>

              <div className="flex items-center space-x-4">
                <RadioGroupItem
                  value="customer_number"
                  id="customer_number"
                  className="h-9 w-9 border-2 border-foreground"
                />
                <Label htmlFor="customer_number" className="text-lg font-normal cursor-pointer">
                  I use a UKVI customer number
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
              <Link href="/login/recover" className="text-primary hover:underline text-sm">
                I do not know which identity document I use to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <GovFooter />
    </main>
  );
}
