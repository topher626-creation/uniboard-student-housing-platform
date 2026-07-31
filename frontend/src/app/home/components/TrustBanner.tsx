'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function TrustBanner() {
  return (
    <section className="py-8 bg-green-700 dark:bg-green-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl">Every provider is verified before approval</p>
            <p className="text-green-200 dark:text-green-300 text-sm mt-0.5">We manually review documents, visit properties, and verify landlord identity before any listing goes live.</p>
          </div>
          <div className="sm:ml-auto flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <p className="text-white font-bold text-2xl font-mono">340+</p>
              <p className="text-green-200 dark:text-green-300 text-xs">Verified Providers</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-white font-bold text-2xl font-mono">0</p>
              <p className="text-green-200 dark:text-green-300 text-xs">Reported Scams</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}