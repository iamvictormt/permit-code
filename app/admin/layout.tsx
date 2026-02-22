'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { GovHeader } from '@/components/gov-header';
import { BetaBanner } from '@/components/beta-banner';
import { GovFooter } from '@/components/gov-footer';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/manage-access');
      } else {
        setIsAdmin(true);
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-govuk-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <BetaBanner />
      <div className="bg-govuk-grey-3 border-b border-govuk-grey-2">
        <div className="max-w-[960px] mx-auto px-4 py-2 flex justify-between items-center">
           <span className="font-bold">Admin Panel</span>
           <div className="text-sm">
             Logged in as <span className="font-bold">{user?.full_name}</span>
           </div>
        </div>
      </div>
      <main className="flex-1 max-w-[960px] mx-auto w-full px-4 py-8">
        {children}
      </main>
      <GovFooter />
    </div>
  );
}
