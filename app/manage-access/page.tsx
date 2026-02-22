'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GovHeader } from '@/components/gov-header';
import { BetaBanner } from '@/components/beta-banner';
import { GovFooter } from '@/components/gov-footer';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithUser } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        loginWithUser({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.fullName,
          role: 'admin',
        });
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <BetaBanner />
      <main className="flex-1 max-w-[960px] mx-auto w-full px-4 py-8">
        <div className="max-w-[600px]">
          <h1 className="text-4xl font-bold mb-8">Admin Access</h1>

          {error && (
            <div className="border-4 border-destructive p-4 mb-8">
              <h2 className="text-destructive text-xl font-bold mb-2">There is a problem</h2>
              <p className="text-destructive font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-xl font-bold mb-2 block">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-xl font-bold mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#00703c] hover:bg-[#005a30] text-white font-bold rounded-none px-6 py-2 h-auto text-xl shadow-[0_2px_0_#002d18]"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </main>
      <GovFooter />
    </div>
  );
}
