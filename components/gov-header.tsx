import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function GovHeader() {
  return (
    <header className="bg-govuk-blue mb-2 py-4 ">
      <div className="max-w-[960px] mx-auto flex items-center px-4">
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
          <Image src="/logo.svg" alt="GOV.UK logo" width={32} height={16} className="w-48 h-12" />
        </Link>
      </div>
    </header>
  );
}
