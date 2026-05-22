'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';
import { Shield, Star, Users, Home } from 'lucide-react';

const trustPoints = [
  { key: 'tp-verified', icon: Shield, text: '2,400+ verified listings' },
  { key: 'tp-students', icon: Users, text: '8,500+ students housed' },
  { key: 'tp-rated', icon: Star, text: 'Rated 4.8/5 by students' },
  { key: 'tp-rooms', icon: Home, text: 'Rooms near 50+ universities' },
];

export default function AuthPageClient() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col justify-between hero-gradient p-10 xl:p-14 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/home" className="flex items-center gap-2.5">
            <AppLogo size={40} />
            <span className="text-white font-bold text-2xl">UniBoard</span>
          </Link>
        </div>

        {/* Central Content */}
        <div className="relative z-10 max-w-sm">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
            Your student home
            <br />
            starts here
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-8">
            Join thousands of students who found verified, affordable accommodation near their
            university through UniBoard.
          </p>

          {/* Trust Points */}
          <div className="space-y-3.5">
            {trustPoints?.map((tp) => (
              <div key={tp?.key} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <tp.icon size={17} className="text-blue-200" />
                </div>
                <span className="text-white/85 text-sm font-medium">{tp?.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
          <p className="text-white/85 text-sm italic leading-relaxed mb-3">
            &ldquo;I found my room in two days. The verified badge meant I could trust the listing
            completely. UniBoard saved my semester.&rdquo;
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-blue-900 font-bold text-sm">
              N
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Nomvula K.</p>
              <p className="text-white/60 text-xs">UCT, 2nd Year</p>
            </div>
            <div className="ml-auto flex gap-0.5">
              {Array.from({ length: 5 })?.map((_, i) => (
                <Star key={`quote-star-${i}`} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 xl:px-16 py-10 bg-gray-50">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <Link href="/home" className="flex items-center gap-2">
            <AppLogo size={36} />
            <span className="font-bold text-xl text-gray-900">UniBoard</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Tab Switcher */}
          <div className="flex bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'login' ? 'bg-green-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'signup' ? 'bg-green-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <div className="animate-fade-in">
            {activeTab === 'login' ? (
              <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
            ) : (
              <SignupForm onSwitchToLogin={() => setActiveTab('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}