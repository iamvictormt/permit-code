import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function GovHeader() {
  return (
    <header className="mb-0">
      {/* Black Bar */}
      <div className="bg-black py-2 px-4">
        <div className="max-w-[960px] mx-auto flex items-center">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
            <Image src="/logo.svg" alt="GOV.UK" width={162} height={30} className="w-36 h-auto brightness-0 invert" />
          </Link>
        </div>
      </div>
      {/* Blue Bar */}
      <div className="bg-govuk-blue py-3 px-4">
        <div className="max-w-[960px] mx-auto">
          <h1 className="text-white text-2xl font-bold mb-0">Prove your right to work</h1>
        </div>
      </div>
    </header>
  );
}
