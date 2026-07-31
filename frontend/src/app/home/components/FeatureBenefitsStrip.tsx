'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, LayoutGrid, Zap, Users } from 'lucide-react';

const benefits = [
  {
    key: 'verified-safe',
    icon: ShieldCheck,
    title: 'Verified & Safe',
    description: 'Real verification for trusted landlords and secure student housing.',
  },
  {
    key: 'wide-selection',
    icon: LayoutGrid,
    title: 'Wide Selection',
    description: 'Explore bedspaces across top campuses with accurate photos & details.',
  },
  {
    key: 'real-time',
    icon: Zap,
    title: 'Real-Time Availability',
    description: 'See what\'s available now and avoid wasting time on outdated listings.',
  },
  {
    key: 'student-focused',
    icon: Users,
    title: 'Student Focused',
    description: 'Built around student needs—clear pricing, quick contact, and support.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function FeatureBenefitsStrip() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-700"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
            {benefits.map((b) => (
              <motion.div
                key={b.key}
                variants={itemVariants}
                className="group px-6 py-10 hover:bg-green-50/40 dark:hover:bg-green-900/20 transition-colors duration-200"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-[18px] bg-green-50 dark:bg-green-900/50 border border-green-100 dark:border-green-800 mb-4">
                  <b.icon size={20} className="text-green-700 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-800 dark:group-hover:text-green-400 transition-colors">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}