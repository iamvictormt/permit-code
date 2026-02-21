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
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { GovHeader } from '@/components/gov-header';
import { BetaBanner } from '@/components/beta-banner';
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
      setError('Select which identity document you use to sign in');
      return;
    }
    setError('');
    setStep('document_number');
  };

  const handleContinueToDateOfBirth = () => {
    if (!documentNumber) {
      setError(`Enter your ${getDocumentLabel().toLowerCase()}`);
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
      // Construct a generic error message for the summary box
      setError('Check your date of birth is correct');
      return;
    }

    setStep('security_code');
  };

  const handleContinueToVerifyCode = () => {
    if (!securityCodeMethod) {
      setError('Select how you want to receive a security code');
      return;
    }
    setError('');
    setStep('verify_code');
  };

  const handleVerifyCode = async () => {
    if (!securityCode || securityCode.length !== 6) {
      setError('Enter the 6-digit security code');
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
        return 'For example, 120382978';
      case 'biometric_card':
        return 'For example, 120382978';
      case 'customer_number':
        return 'For example, KX12345678';
      default:
        return '';
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

  const goBack = () => {
    switch (step) {
      case 'document_number':
        setStep('document');
        break;
      case 'date_of_birth':
        setStep('document_number');
        break;
      case 'security_code':
        setStep('date_of_birth');
        break;
      case 'verify_code':
        setStep('security_code');
        break;
      default:
        break;
    }
    setError('');
  };

  if (step === 'verify_code') {
    return (
      <PageLayout goBack={goBack} error={error}>
        <span className="text-govuk-grey-1 text-xl block mb-2">Sign in</span>
        <h1 className="text-4xl font-bold mb-6">Check your {securityCodeMethod === 'email' ? 'email' : 'phone'}</h1>
        <p className="text-lg mb-4">
          We have sent you a single-use, 6-digit security code by{' '}
          {securityCodeMethod === 'email' ? 'email' : 'text message'} to:
        </p>
        <p className="text-lg font-bold mb-4">
          {securityCodeMethod === 'email' ? 'v***********p@gmail.com' : '075*****886'}
        </p>
        <p className="text-lg mb-8">
          It may take a few minutes to arrive. You need to use this code within 10 minutes or it will expire.
        </p>

        <div className="mb-8">
          <Label htmlFor="securityCode" className="font-bold mb-2 block">
            Security code
          </Label>
          <Input
            id="securityCode"
            type="text"
            className="w-40"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
          />
        </div>

        <Button onClick={handleVerifyCode} disabled={isLoading} className="mb-8">
          {isLoading ? 'Verifying...' : 'Continue'}
        </Button>

        <p className="text-lg">
          <button className="underline hover:text-govuk-blue">Resend security code</button>
        </p>

        <div className="mt-12 pt-8 border-t border-govuk-grey-2">
          <h2 className="text-2xl font-bold mb-4">Problems signing in</h2>
          <p className="text-lg mb-4">
            If you do not have access to this {securityCodeMethod === 'email' ? 'email address' : 'phone number'},{' '}
            <button
              onClick={() => {
                setSecurityCodeMethod(securityCodeMethod === 'email' ? 'sms' : 'email');
                setStep('security_code');
              }}
              className="underline hover:text-govuk-blue"
            >
              use your {securityCodeMethod === 'email' ? 'phone number' : 'email address'} instead
            </button>
            .
          </p>
          <p className="text-lg">
            If you do not have access to your phone number and email address,{' '}
            <Link href="/login/recover" className="underline hover:text-govuk-blue">
              recover your account
            </Link>
            .
          </p>
        </div>
      </PageLayout>
    );
  }

  if (step === 'security_code') {
    return (
      <PageLayout goBack={goBack} error={error}>
        <span className="text-govuk-grey-1 text-xl block mb-2">Sign in</span>
        <h1 className="text-4xl font-bold mb-8">How do you want to receive a security code?</h1>

        <RadioGroup
          value={securityCodeMethod}
          onValueChange={(val) => setSecurityCodeMethod(val as SecurityCodeMethod)}
          className="mb-8"
        >
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="sms" id="sms" />
            <Label htmlFor="sms" className="text-lg cursor-pointer">
              Send a text message (SMS) to <span className="font-bold">075*****886</span>
            </Label>
          </div>
          <div className="flex items-center space-x-4">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email" className="text-lg cursor-pointer">
              Send an email to <span className="font-bold">v***********p@gmail.com</span>
            </Label>
          </div>
        </RadioGroup>

        <Button onClick={handleContinueToVerifyCode} className="bg-[#00703c] hover:bg-[#005a30] text-white font-bold rounded-none px-4 py-2 h-auto text-sm sm:text-base shadow-[0_2px_0_#002d18] mb-8">
          Continue
        </Button>

        <div className="mt-12 pt-8 border-t border-govuk-grey-2">
          <h2 className="text-2xl font-bold mb-4">Problems signing in</h2>
          <p className="text-lg">
            If you do not have access to the phone number and email address,{' '}
            <Link href="/login/recover" className="underline hover:text-govuk-blue">
              recover your account
            </Link>
            .
          </p>
        </div>
      </PageLayout>
    );
  }

  if (step === 'date_of_birth') {
    return (
      <PageLayout goBack={goBack} error={error}>
        <span className="text-govuk-grey-1 text-xl block mb-2">Sign in</span>
        <h1 className="text-4xl font-bold mb-6">What is your date of birth?</h1>
        <p className="text-lg text-govuk-grey-1 mb-8">
          You should enter this as shown on your passport. For example, 31 3 1980.
        </p>

        <form onSubmit={handleContinueToSecurityCode}>
          <div className="flex gap-4 mb-8">
            <div className="w-16">
              <Label htmlFor="day" className="font-bold mb-1 block">
                Day
              </Label>
              <Input
                id="day"
                className={dateErrors.day ? 'border-destructive' : ''}
                value={dateOfBirth.day}
                onChange={(e) => handleDateChange('day', e.target.value)}
                maxLength={2}
              />
              {dateErrors.day && <p className="text-destructive font-bold text-sm mt-1">{dateErrors.day}</p>}
            </div>
            <div className="w-16">
              <Label htmlFor="month" className="font-bold mb-1 block">
                Month
              </Label>
              <Input
                id="month"
                className={dateErrors.month ? 'border-destructive' : ''}
                value={dateOfBirth.month}
                onChange={(e) => handleDateChange('month', e.target.value)}
                maxLength={2}
              />
              {dateErrors.month && <p className="text-destructive font-bold text-sm mt-1">{dateErrors.month}</p>}
            </div>
            <div className="w-24">
              <Label htmlFor="year" className="font-bold mb-1 block">
                Year
              </Label>
              <Input
                id="year"
                className={dateErrors.year ? 'border-destructive' : ''}
                value={dateOfBirth.year}
                onChange={(e) => handleDateChange('year', e.target.value)}
                maxLength={4}
              />
              {dateErrors.year && <p className="text-destructive font-bold text-sm mt-1">{dateErrors.year}</p>}
            </div>
          </div>
          <Button type="submit">Continue</Button>
        </form>

        <div className="mt-12 bg-govuk-grey-3 border-l-8 border-govuk-grey-1 p-4">
          <p className="text-lg mb-0">
            Need help?{' '}
            <a href="#" className="underline text-govuk-blue hover:decoration-3">
              Contact us
            </a>
          </p>
        </div>
      </PageLayout>
    );
  }

  if (step === 'document_number') {
    return (
      <PageLayout goBack={goBack} error={error}>
        <span className="text-govuk-grey-1 text-xl block mb-2">Sign in</span>
        <h1 className="text-4xl font-bold mb-8">{getDocumentTitle()}</h1>

        {documentType === 'biometric_card' && (
          <Image
            src="/biometric-residence-card.png"
            alt="Example of biometric card"
            width={400}
            height={300}
            className="object-contain"
          />
        )}

        <div className="mb-8">
          {documentType === 'customer_number' ? (
            <div className="space-y-4">
              <p className="text-lg">
                You will have a UKVI customer number if you did not use an identity document to create your account.
              </p>
              <p className="text-lg font-bold">
                Your UKVI customer number is 10 characters long and starts with KX, for example KX12345678.
              </p>
              <div className="flex">
                <div className="flex items-center justify-center px-3 border-2 border-r-0 border-govuk-black bg-govuk-grey-3 font-bold text-lg">
                  KX
                </div>
                <Input
                  className="flex-1"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  maxLength={8}
                />
              </div>
            </div>
          ) : (
            <>
              <p className="text-govuk-grey-1 mb-2 text-xl">{getDocumentLabel()}</p>
              <p className="text-govuk-grey-1 mb-2 text-xl">{getDocumentExample()}</p>
              <Input
                id="documentNumber"
                className="w-full"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </>
          )}
        </div>

        <Button onClick={handleContinueToDateOfBirth} className="bg-[#00703c] hover:bg-[#005a30] text-white font-bold rounded-none px-4 py-2 h-auto text-sm sm:text-base shadow-[0_2px_0_#002d18] mb-8">
          Continue
        </Button>

        <p className="text-lg">
          <Link href="/login/recover" className="underline text-govuk-blue">
            {getHelpLink()}
          </Link>
        </p>
      </PageLayout>
    );
  }

  // Default step: document selection
  return (
    <PageLayout showBack={false} goBack={goBack} error={error}>
      <span className="text-govuk-grey-1 text-xl block mb-2">Sign in</span>
      <h1 className="text-4xl font-bold mb-6">Which identity document do you use to sign in to your UKVI account?</h1>

      <p className="text-lg mb-8">
        This is usually the document you used when you created your account. If you have added a new document to your
        account, use the most recent document to sign in.
      </p>

      <RadioGroup value={documentType} onValueChange={(val) => setDocumentType(val as DocumentType)} className="mb-8">
        <div className="flex items-center space-x-4">
          <RadioGroupItem value="passport" id="passport" />
          <Label htmlFor="passport" className="text-lg cursor-pointer">
            Passport
          </Label>
        </div>
        <div className="flex items-center space-x-4">
          <RadioGroupItem value="national_id" id="national_id" />
          <Label htmlFor="national_id" className="text-lg cursor-pointer">
            National identity card
          </Label>
        </div>
        <div className="flex items-center space-x-4">
          <RadioGroupItem value="biometric_card" id="biometric_card" />
          <Label htmlFor="biometric_card" className="text-lg cursor-pointer">
            Biometric residence card or permit
          </Label>
        </div>
        <div className="py-2 text-lg">or</div>
        <div className="flex items-center space-x-4">
          <RadioGroupItem value="customer_number" id="customer_number" />
          <Label htmlFor="customer_number" className="text-lg cursor-pointer">
            I use a UKVI customer number
          </Label>
        </div>
      </RadioGroup>

      <Button onClick={handleContinueToDocumentNumber} className="bg-[#00703c] hover:bg-[#005a30] text-white font-bold rounded-none px-4 py-2 h-auto text-sm sm:text-base shadow-[0_2px_0_#002d18] mb-8">
        Continue
      </Button>

      <p className="text-lg">
        <Link href="/login/recover" className="underline text-govuk-blue">
          I do not know which identity document I use to sign in
        </Link>
      </p>
    </PageLayout>
  );
}

const PageLayout = ({
  children,
  showBack = true,
  goBack,
  error,
}: {
  children: React.ReactNode;
  showBack?: boolean;
  goBack: () => void;
  error: string;
}) => (
  <div className="min-h-screen flex flex-col bg-white">
    <GovHeader />
    <BetaBanner />
    <main className="flex-1 max-w-[960px] mx-auto w-full px-4 py-8">
      {showBack && (
        <button
          onClick={goBack}
          className="text-govuk-black underline hover:hover:decoration-3 mb-8 flex items-center gap-1 text-lg cursor-pointer "
        >
          <span className="inline-block border-l-2 border-b-2 border-current w-2.5 h-2.5 rotate-45 mr-1 mb-0.5"></span>
          Back
        </button>
      )}
      <div className="max-w-[600px]">
        {error && (
          <div className="border-4 border-destructive p-4 mb-8">
            <h2 className="text-destructive text-xl font-bold mb-2">There is a problem</h2>
            <ul className="text-destructive font-bold underline">
              <li>
                <a href="#error-link">{error}</a>
              </li>
            </ul>
          </div>
        )}
        {children}
      </div>
    </main>
    <GovFooter />
  </div>
);
