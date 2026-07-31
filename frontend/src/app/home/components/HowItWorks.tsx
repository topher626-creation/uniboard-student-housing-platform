'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileCheck, MessageCircle, Key } from 'lucide-react';

const steps = [
  {
    key: 'step-search',
    icon: Search,
    title: 'Search & Filter',
    description: 'Enter your university, preferred room type, and budget. Filter by campus, location, price, and gender preference.',
    color: 'bg-green-700',
    accent: 'text-green-700',
    lightBg: 'bg-green-50 dark:bg-green-900/30',
    tag: 'Step 1',
  },
  {
    key: 'step-compare',
    icon: FileCheck,
    title: 'Compare & Verify',
    description: 'View detailed listings with real photos and student reviews. Check the verified badge to confirm the provider has passed our verification.',
    color: 'bg-amber-500',
    accent: 'text-amber-600 dark:text-amber-400',
    lightBg: 'bg-amber-50 dark:bg-amber-900/30',
    tag: 'Step 2',
  },
  {
    key: 'step-contact',
    icon: MessageCircle,
    title: 'Contact Provider',
    description: 'Reach out directly via WhatsApp or phone call. Ask questions, schedule viewings, and negotiate terms with confidence.',
    color: 'bg-green-600',
    accent: 'text-green-600 dark:text-green-400',
    lightBg: 'bg-green-50 dark:bg-green-900/30',
    tag: 'Step 3',
  },
  {
    key: 'step-move',
    icon: Key,
    title: 'Book & Move In',
    description: 'Confirm your booking and move into your new student home. Leave a review to help future students make informed decisions.',
    color: 'bg-amber-600',
    accent: 'text-amber-600 dark:text-amber-400',
    lightBg: 'bg-amber-50 dark:bg-amber-900/30',
    tag: 'Step 4',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="how-it-works">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left heading */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-green-700 dark:text-green-400 mb-3">Simple Process</p>
            <h2 className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-4">How UniBoard Works</h2>
            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-6">
              From search to move-in in four straightforward steps. Most students find and confirm a bedspace within 48 hours.
            </p>
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-5">
              <p className="text-green-800 dark:text-green-300 font-semibold text-sm mb-1">🇿🇲 Built for Zambia</p>
              <p className="text-green-700 dark:text-green-400 text-sm leading-relaxed">UniBoard is designed specifically for Zambian students and universities. All providers are locally verified.</p>
            </div>
          </motion.div>

          {/* Right steps — asymmetric layout */}
          <motion.div
            className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {steps?.map((step, idx) => (
              <motion.div
                key={step?.key}
                variants={itemVariants}
                className={`rounded-2xl p-6 ${idx === 0 ? 'sm:col-span-2 flex items-start gap-5' : ''} ${step?.lightBg} border border-transparent hover:border-green-200 dark:hover:border-green-700 transition-all duration-200`}
              >
                <div className={`w-12 h-12 ${step?.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <step.icon size={22} className="text-white" />
                </div>
                <div className={idx === 0 ? '' : 'mt-4'}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${step?.accent} mb-1 block`}>{step?.tag}</span>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{step?.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step?.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}