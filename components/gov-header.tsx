import React from 'react';
import Link from 'next/link';

export function GovHeader() {
  return (
    <header className="bg-govuk-black border-b-[10px] border-govuk-blue py-2 px-4 mb-6">
      <div className="max-w-[960px] mx-auto flex items-center">
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center overflow-hidden">
            {/* Crown Placeholder */}
            <div className="text-govuk-black text-[10px] font-bold">GOV</div>
          </div>
          <span className="text-2xl font-bold tracking-tighter">GOV.UK</span>
        </Link>
      </div>
    </header>
  );
}
