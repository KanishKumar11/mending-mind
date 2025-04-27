"use client";

import { useState } from 'react';
import { useAuth } from '@/app/lib/auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import Image from 'next/image';

export default function LoginForm() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (login(pin)) {
      setError('');
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-full flex justify-center mb-4">
            <Image
              src="/Mind_Logo.png"
              alt="Mending Mind Logo"
              width={150}
              height={60}
              priority
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Dashboard Access</CardTitle>
          <CardDescription className="text-center">
            Enter your PIN to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Input
                id="pin"
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="text-center text-xl tracking-widest"
                maxLength={4}
              />
              {error && (
                <p className="text-sm font-medium text-red-500 text-center">{error}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full mt-4 bg-[#F0C93B] hover:bg-[#e0b92b] text-black"
            >
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-gray-500">
            Contact administrator if you need access
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
