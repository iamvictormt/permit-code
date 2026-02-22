'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function GovHeader() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const headerBgColor = isAuthenticated && pathname.includes('/profile') ? 'bg-black' : 'bg-govuk-blue';
  const showBlackBar = isAuthenticated && pathname.includes('/profile');

  return (
    <header>
      <div className={`${headerBgColor} py-3 transition-colors`}>
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity px-4">
              <Image
                src="/logo.svg"
                alt="GOV.UK logo"
                width={32}
                height={16}
                className="w-48 h-24 brightness-0 invert"
              />
            </Link>
          </div>
        </div>
        {showBlackBar && (
          <div className="bg-black py-3">
            <div className="max-w-[960px] mx-auto px-4">
              <h1 className="text-white text-2xl font-bold mb-0">Prove your right to work</h1>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
