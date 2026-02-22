'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { RotateCw, Play } from 'lucide-react';
import Link from 'next/link';
import { GovFooter } from '@/components/gov-footer';
import { GovHeader } from '@/components/gov-header';
import { BetaBanner } from '@/components/beta-banner';

interface ProfileData {
  full_name: string;
  right_to_work_until: string;
  conditions: string;
  legal_basis: string;
  photo_url: string;
}

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [legalBasisOpen, setLegalBasisOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [imageRotation, setImageRotation] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/profile?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProfileData(data);
          setFetchingProfile(false);
        })
        .catch((err) => {
          console.error(err);
          setFetchingProfile(false);
        });
    }
  }, [user?.id]);

  const handleRotate = () => {
    setImageRotation((prev) => (prev + 90) % 360);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading || fetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl text-destructive">User not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <BetaBanner />
      <main className="flex-1 max-w-[960px] mx-auto w-full px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Your right to work</h1>

        <div className="max-w-[640px]">
          {/* Main Card with Blue Border */}
          <div className="border-[1px] border-govuk-blue shadow-sm mb-12">
            {/* Header with blue background */}
            <div className="bg-govuk-blue text-white px-4 py-2 text-xl font-bold">
              Right to work
            </div>

            <div className="p-6">
              {/* Photo and Rotate Section */}
              <div className="mb-6">
                <div
                  className="inline-block border-[1px] border-govuk-grey-2 bg-govuk-grey-3 p-0 mb-4 transition-transform duration-300"
                  style={{ transform: `rotate(${imageRotation}deg)` }}
                >
                  <img
                    src={profileData.photo_url || '/placeholder.svg'}
                    alt="Profile photo"
                    className="w-[140px] h-[180px] object-cover"
                  />
                </div>
                <div>
                  <button
                    onClick={handleRotate}
                    className="flex items-center gap-2 bg-govuk-grey-3 hover:bg-govuk-grey-2 text-govuk-black px-4 py-2 border-b-2 border-govuk-grey-1 text-lg"
                  >
                    Rotate
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* User Name */}
              <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight">
                {profileData.full_name}
              </h2>

              {/* Status Sentence */}
              <p className="text-xl mb-8 leading-relaxed">
                You have the right to work in the UK until{' '}
                <span className="font-bold">{formatDate(profileData.right_to_work_until)}</span>.
              </p>

              {/* Conditions Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Conditions</h3>
                <p className="text-xl mb-6">{profileData.conditions}</p>

                <div className="space-y-6 text-govuk-black leading-relaxed">
                  <p className="text-lg">
                    To continue to work after this date, you will need to have either pre-settled status or settled status
                    under the EU Settlement Scheme (or another type of permission to stay).
                  </p>
                  <p className="text-lg">
                    You can apply to switch to settled status as soon as you are eligible for it. This is usually once you
                    have lived in the UK for 5 years. Find out{' '}
                    <button className="text-govuk-blue underline hover:decoration-3">how to switch to settled status</button>.
                  </p>
                </div>
              </div>

              {/* Legal Basis Toggle */}
              <div>
                <button
                  onClick={() => setLegalBasisOpen(!legalBasisOpen)}
                  className="flex items-center gap-2 text-govuk-blue underline hover:decoration-3 text-lg"
                >
                  <Play className={`w-3 h-3 fill-govuk-blue transition-transform ${legalBasisOpen ? 'rotate-90' : ''}`} />
                  Legal basis of status
                </button>

                {legalBasisOpen && (
                  <div className="mt-4 p-4 bg-govuk-grey-3 border-l-4 border-govuk-grey-2">
                    <p className="text-lg mb-0">{profileData.legal_basis}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prove your right to work Section */}
          <div className="border-t-[1px] border-govuk-grey-2 pt-8">
            <h2 className="text-2xl font-bold mb-4">Prove your right to work</h2>
            <p className="text-lg mb-6 leading-relaxed">
              To share your details with an employer, you need to create a right to work share code.
            </p>
            <Button asChild className="bg-[#00703c] hover:bg-[#005a30] text-white font-bold rounded-none px-6 py-4 h-auto text-xl shadow-[0_4px_0_#002d18] w-full sm:w-auto">
              <Link href="/profile/share-code">Get a share code</Link>
            </Button>
          </div>
        </div>
      </main>
      <GovFooter />
    </div>
  );
}
