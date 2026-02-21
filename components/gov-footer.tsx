"use client"

import React from 'react';

export function GovFooter() {
  return (
    <footer className="w-full bg-govuk-grey-3 border-t-[12px] border-govuk-blue mt-12 py-10 px-4">
      <div className="max-w-[960px] mx-auto">
            <nav>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                <li><a href="#" className="text-sm underline hover:decoration-3">Privacy</a></li>
                <li><a href="#" className="text-sm underline hover:decoration-3">Cookies</a></li>
                <li><a href="#" className="text-sm underline hover:decoration-3">Accessibility statement</a></li>
                <li><a href="#" className="text-sm underline hover:decoration-3">Account terms and conditions</a></li>
              </ul>
            </nav>
            
            <div className="flex items-start gap-3">
              <p className="text-sm">
                All content is available under the <a href="#" className="underline hover:text-govuk-blue">Open Government Licence v3.0</a>, except where otherwise stated
              </p>
            </div>
 
      </div>
    </footer>
  )
}
