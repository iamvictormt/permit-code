'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function CookieBanner() {
  const [status, setStatus] = useState<'hidden' | 'question' | 'accepted' | 'rejected'>('hidden');

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setStatus('question');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setStatus('accepted');
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setStatus('rejected');
  };

  const handleHide = () => {
    setStatus('hidden');
  };

  if (status === 'hidden') return null;

  return (
    <div
      className="bg-[#f3f2f1] border-b-4 border-[#bfc1c3] py-6 px-4 sm:px-6 lg:px-8"
      role="region"
      aria-label="Cookie banner"
    >
      <div className="max-w-5xl mx-auto">
        {status === 'question' ? (
          <>
            <h2 className="text-xl font-bold text-[#0b0c0c] mb-4">Cookies on PermitCode</h2>
            <div className="text-[#0b0c0c] mb-6 space-y-4 text-sm sm:text-base">
              <p>We use some essential cookies to make this service work.</p>
              <p>
                We’d also like to use analytics cookies so we can understand how you use the service and make improvements.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleAccept}
                className="bg-[#00703c] hover:bg-[#005a30] text-white font-bold rounded-none px-4 py-2 h-auto text-sm sm:text-base shadow-[0_2px_0_#002d18]"
              >
                Accept analytics cookies
              </Button>
              <Button
                onClick={handleReject}
                className="bg-[#00703c] hover:bg-[#005a30] text-white font-bold rounded-none px-4 py-2 h-auto text-sm sm:text-base shadow-[0_2px_0_#002d18]"
              >
                Reject analytics cookies
              </Button>
              <Link
                href="/cookies"
                className="text-[#1d70b8] hover:text-[#003078] underline decoration-2 underline-offset-4 font-normal flex items-center text-sm sm:text-base"
              >
                View cookies
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-[#0b0c0c] mb-6 text-sm sm:text-base">
              <p>
                You’ve {status === 'accepted' ? 'accepted' : 'rejected'} additional cookies. You can{' '}
                <Link href="/cookies" className="text-[#1d70b8] underline decoration-2 underline-offset-4">
                  change your cookie settings
                </Link>{' '}
                at any time.
              </p>
            </div>
            <Button
              onClick={handleHide}
              className="bg-[#00703c] hover:bg-[#005a30] text-white font-bold rounded-none px-4 py-2 h-auto text-sm sm:text-base shadow-[0_2px_0_#002d18]"
            >
              Hide cookie message
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
