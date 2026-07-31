'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star } from 'lucide-react';
import { providers } from '@/lib/mockData';
import AppImage from '@/components/ui/AppImage';

const verifiedProviders = providers?.filter((p) => p?.verified);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function VerifiedProviders() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-green-700 dark:text-green-400 mb-2">Trusted Partners</p>
          <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white">Verified Providers</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">These providers have passed our full verification process</p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {verifiedProviders?.map((provider) => (
            <motion.div
              key={provider?.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-green-200 dark:hover:border-green-700 transition-all duration-200"
            >
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                <AppImage src={provider?.avatar} alt={`${provider?.name} profile photo`} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{provider?.name}</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 flex-shrink-0">
                    <Shield size={9} />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{provider?.compoundName}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{provider?.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">{provider?.totalListings} listing{provider?.totalListings !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}