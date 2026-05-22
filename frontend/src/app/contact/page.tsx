'use client';

import React, { useState } from 'react';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: 'Email Us', value: 'hello@uniboard.zm', href: 'mailto:hello@uniboard.zm', color: 'bg-green-100 text-green-700' },
  { icon: Phone, label: 'Call Us', value: '+260 97 000 1234', href: 'tel:+260970001234', color: 'bg-amber-100 text-amber-700' },
  { icon: MapPin, label: 'Visit Us', value: 'Kitwe, Zambia', href: '#', color: 'bg-blue-100 text-blue-700' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Topbar />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-3">Get in Touch</p>
          <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-4">Contact UniBoard</h1>
          <p className="text-lg text-gray-500 max-w-xl">Have a question, issue, or want to partner with us? We&apos;re here to help. Our team typically responds within 24 hours.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-green-200 transition-all duration-200 block"
                >
                  <div className={`w-12 h-12 ${info.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <info.icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{info.label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{info.value}</p>
                  </div>
                </a>
              ))}

              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="font-semibold text-green-800 mb-2">Provider Verification</p>
                <p className="text-green-700 text-sm leading-relaxed">
                  If you are a provider waiting for verification, email us at <strong>verify@uniboard.zm</strong> with your documents and we will process within 48 hours.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm max-w-sm">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-6 text-sm font-semibold text-green-700 hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                      <select
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select a subject</option>
                        <option>General Enquiry</option>
                        <option>Provider Verification</option>
                        <option>Report a Listing</option>
                        <option>Technical Support</option>
                        <option>Partnership</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-70"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

