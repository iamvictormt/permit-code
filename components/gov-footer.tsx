"use client"

import React from 'react';

export function GovFooter() {
  return (
    <footer className="w-full bg-govuk-grey-3 border-t-[12px] border-govuk-blue mt-12 py-10 px-4">
      <div className="max-w-[960px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <nav>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 mb-8 border-b border-govuk-grey-2 pb-8">
                <li><a href="#" className="text-sm font-bold underline hover:text-govuk-blue">Privacy</a></li>
                <li><a href="#" className="text-sm font-bold underline hover:text-govuk-blue">Cookies</a></li>
                <li><a href="#" className="text-sm font-bold underline hover:text-govuk-blue">Accessibility statement</a></li>
                <li><a href="#" className="text-sm font-bold underline hover:text-govuk-blue">Account terms and conditions</a></li>
              </ul>
            </nav>
            
            <div className="flex items-start gap-3">
              <div className="w-12 h-8 bg-govuk-grey-2 shrink-0 flex items-center justify-center text-[8px] text-center">OGL LOGO</div>
              <p className="text-sm">
                All content is available under the <a href="#" className="underline hover:text-govuk-blue">Open Government Licence v3.0</a>, except where otherwise stated
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end justify-end">
            <div className="w-32 h-20 bg-govuk-grey-2 mb-2 flex items-center justify-center text-[10px] text-center">CROWN COPYRIGHT LOGO</div>
            <p className="text-sm">© Crown copyright</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
