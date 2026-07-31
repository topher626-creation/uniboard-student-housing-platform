'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { universities } from '@/lib/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function UniversitySection() {
  return (
    <section className="py-14 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-green-700 dark:text-green-400 mb-2">Browse by Campus</p>
            <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white">Popular Universities</h2>
          </div>
          <Link href="/room-listing-page" className="text-sm font-semibold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors flex-shrink-0">
            View all listings →
          </Link>
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {universities?.map((uni) => (
            <motion.div key={uni?.id} variants={itemVariants}>
              <Link
                href={`/room-listing-page?campus=${uni?.name}`}
                className="group flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 hover:shadow-md rounded-2xl px-5 py-3.5 transition-all duration-200"
              >
                <div className={`w-10 h-10 ${uni?.color} rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                  {uni?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{uni?.name}</p>
                  <p className="text-xs text-gray-400">{uni?.city}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}