'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ShieldCheck, Users, Zap } from 'lucide-react';

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
    description: 'Explore bedspaces across top campuses with accurate photos and details.',
  },
  {
    key: 'real-time',
    icon: Zap,
    title: 'Real-Time Availability',
    description: "See what's available now and avoid wasting time on outdated listings.",
  },
  {
    key: 'student-focused',
    icon: Users,
    title: 'Student Focused',
    description: 'Built around student needs: clear pricing, quick contact, and support.',
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
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <motion.div
          className="border-y border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
            {benefits.map((b) => (
              <motion.div
                key={b.key}
                variants={itemVariants}
                className="group px-6 py-10 transition-colors duration-200 hover:bg-green-50/40 dark:hover:bg-green-900/20"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-green-100 bg-green-50 dark:border-green-800 dark:bg-green-900/50">
                  <b.icon size={20} className="text-green-700 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-green-800 dark:text-white dark:group-hover:text-green-400">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
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
