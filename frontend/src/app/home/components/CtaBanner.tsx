'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Building2, Shield } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <motion.div
          className="relative overflow-hidden rounded-3xl p-10 lg:p-16"
          style={{ background: 'linear-gradient(135deg, #0a2e1a 0%, #1B4332 50%, #2d6a4f 100%)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Students CTA */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-5">
                <Home size={14} className="text-green-300" />
                <span className="text-white/90 text-sm font-medium">For Students</span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
                Your perfect bedspace is
                <br />
                <span className="text-amber-400">one search away</span>
              </h2>
              <p className="text-white/70 text-base mb-7 leading-relaxed">
                Join 8,500+ Zambian students who found their home through UniBoard. Create a free account and start searching verified bedspaces near your campus today.
              </p>
              <Link
                href="/sign-up-login-screen"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl active:scale-95 transition-all duration-150 shadow-lg"
              >
                Browse Bedspaces
                <ArrowRight size={17} />
              </Link>
            </motion.div>

            {/* Providers CTA */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-5">
                <Building2 size={14} className="text-amber-300" />
                <span className="text-white/90 text-sm font-medium">For Providers</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">List Your Bedspace for Free</h3>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Reach thousands of verified students actively looking for accommodation near Zambian universities. Get your property filled faster.
              </p>
              <ul className="space-y-2.5 mb-7">
                {['Free bedspace listing', 'Verified student inquiries only', 'Dashboard to manage bookings', 'Admin verification support']?.map((item) => (
                  <li key={`benefit-${item}`} className="flex items-center gap-2.5 text-white/80 text-sm">
                    <div className="w-5 h-5 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 mb-4 bg-white/10 rounded-xl p-3">
                <Shield size={16} className="text-green-400 flex-shrink-0" />
                <p className="text-white/70 text-xs">All providers are manually verified by our team before going live</p>
              </div>
              <Link
                href="/sign-up-login-screen"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl active:scale-95 transition-all duration-150"
              >
                List My Bedspace
                <ArrowRight size={17} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}