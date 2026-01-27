'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { GovFooter } from '@/components/gov-footer';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [legalBasisOpen, setLegalBasisOpen] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);

  // Mock user data - in production this would come from the database
  const userData = {
    name: 'VANILDO CARLOS JUSTINO FERNANDES',
    photo: '/placeholder.svg?height=120&width=100',
    rightToWorkUntil: '28 March 2030',
    conditions: 'You can work in any job.',
    legalBasis: 'EU Settlement Scheme - Pre-settled status',
  };

  const handleRotate = () => {
    setImageRotation((prev) => (prev + 90) % 360);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <Link href="/login" className="inline-flex items-center text-foreground hover:underline mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
          {/* Header */}
          <h1 className="text-2xl font-bold text-foreground mb-6">Your right to work</h1>

          {/* Main Card */}
          <div className="border-t-4 border-primary bg-card rounded-sm shadow-sm overflow-hidden">
            {/* Blue Header */}
            <div className="bg-primary px-4 py-2">
              <span className="text-primary-foreground font-medium">Right to work</span>
            </div>

            {/* Card Content */}
            <div className="p-6 border-primary border-2">
              {/* Photo Section */}
              <div className="mb-6">
                <div
                  className="w-28 h-36 bg-muted border border-border overflow-hidden mb-2"
                  style={{ transform: `rotate(${imageRotation}deg)` }}
                >
                  <img
                    src={userData.photo || '/placeholder.svg'}
                    alt="Profile photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleRotate}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded text-foreground"
                >
                  Rotate
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-foreground mb-4 uppercase">{userData.name}</h2>

              {/* Status */}
              <p className="text-foreground mb-6">
                You have the right to work in the UK until{' '}
                <span className="font-medium">{userData.rightToWorkUntil}</span>.
              </p>

              {/* Conditions */}
              <div className="mb-6">
                <h3 className="font-bold text-foreground mb-2">Conditions</h3>
                <p className="text-foreground mb-4">{userData.conditions}</p>
                <p className="text-muted-foreground text-sm mb-4">
                  To continue to work after this date, you will need to have either pre-settled status or settled status
                  under the EU Settlement Scheme (or another type of permission to stay).
                </p>
                <p className="text-muted-foreground text-sm">
                  You can apply to switch to settled status as soon as you are eligible for it. This is usually once you
                  have lived in the UK for 5 years. Find out{' '}
                  <span className="text-primary hover:underline cursor-pointer">how to switch to settled status</span>.
                </p>
              </div>

              {/* Legal Basis Expandable */}
              <button
                onClick={() => setLegalBasisOpen(!legalBasisOpen)}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${legalBasisOpen ? 'rotate-90' : ''}`} />
                <span>Legal basis of status</span>
              </button>

              {legalBasisOpen && (
                <div className="mt-3 pl-6 text-foreground">
                  <p>{userData.legalBasis}</p>
                </div>
              )}
            </div>
          </div>

          {/* Prove your right to work Section */}
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="text-lg font-bold text-foreground mb-3">Prove your right to work</h2>
            <p className="text-muted-foreground mb-6">
              To share your details with an employer, you need to create a right to work share code.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base">
              <Link href="/profile/share-code">Get a share code</Link>
            </Button>
          </div>
        </div>
      </div>
      <GovFooter />
    </main>
  );
}
