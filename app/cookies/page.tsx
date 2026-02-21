'use client';

import React, { useState, useEffect } from 'react';
import { GovHeader } from '@/components/gov-header';
import { BetaBanner } from '@/components/beta-banner';
import { GovFooter } from '@/components/gov-footer';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CookiesPage() {
  const [analyticsConsent, setAnalyticsConsent] = useState<'accepted' | 'rejected'>('rejected');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') {
      setAnalyticsConsent('accepted');
    } else {
      setAnalyticsConsent('rejected');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cookie-consent', analyticsConsent);
    setShowSuccess(true);
    window.scrollTo(0, 0);

    // Dispatch a storage event so the CookieBanner can update if it's listening
    // or just rely on the next refresh/navigation.
    // In this SPA, we might want to trigger a state update in the banner if it was visible.
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <BetaBanner />

      <main className="flex-1 max-w-[960px] mx-auto w-full px-4 py-8">
        <div className="max-w-[600px]">
          {showSuccess && (
            <div className="bg-[#00703c] text-white p-4 mb-8 flex items-start gap-3" role="alert">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <h2 className="font-bold text-xl">Your cookie settings have been saved</h2>
                <p className="mt-2">
                  You can change your settings at any time on this page.
                </p>
              </div>
            </div>
          )}

          <h1 className="text-4xl font-bold mb-8 text-[#0b0c0c]">Cookies</h1>

          <div className="space-y-6 text-[#0b0c0c] text-lg">
            <p>
              Cookies are small files saved on your phone, tablet or computer when you visit a website.
            </p>
            <p>
              We use cookies to make this service work and collect information about how you use our service.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Essential cookies</h2>
            <p>
              Essential cookies keep your information secure while you use this service. We do not need to ask permission to use them.
            </p>

            <table className="w-full border-collapse mb-8 text-base">
              <thead>
                <tr className="border-b border-[#bfc1c3]">
                  <th className="text-left py-2 font-bold">Name</th>
                  <th className="text-left py-2 font-bold">Purpose</th>
                  <th className="text-left py-2 font-bold">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bfc1c3]">
                <tr>
                  <td className="py-2 pr-4">session</td>
                  <td className="py-2 pr-4">Used to keep you signed in</td>
                  <td className="py-2">When you close your browser</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">cookie-consent</td>
                  <td className="py-2 pr-4">Remembers if you’ve allowed cookies</td>
                  <td className="py-2">1 year</td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-2xl font-bold mt-8 mb-4">Analytics cookies (optional)</h2>
            <p>
              With your permission, we use Google Analytics to collect data about how you use this service. This information helps us improve our service.
            </p>
            <p>
              Google Analytics stores information about:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>how you got to the service</li>
              <li>the pages you visit and how long you spend on them</li>
              <li>any errors you see</li>
            </ul>
            <p>
              We do not allow Google to use or share our analytics data.
            </p>

            <div className="bg-[#f3f2f1] p-6 mt-8">
              <RadioGroup
                value={analyticsConsent}
                onValueChange={(val) => setAnalyticsConsent(val as 'accepted' | 'rejected')}
                className="space-y-4"
              >
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="accepted" id="use-analytics-yes" />
                  <Label htmlFor="use-analytics-yes" className="text-lg cursor-pointer">
                    Use cookies that measure my website use
                  </Label>
                </div>
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="rejected" id="use-analytics-no" />
                  <Label htmlFor="use-analytics-no" className="text-lg cursor-pointer">
                    Do not use cookies that measure my website use
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              onClick={handleSave}
              className="mt-8 bg-[#00703c] hover:bg-[#005a30] text-white font-bold rounded-none px-6 py-3 h-auto text-lg shadow-[0_2px_0_#002d18]"
            >
              Save changes
            </Button>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
}
