import React from 'react';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-3">Legal</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              When you register on UniBoard, we collect information you provide such as your name, email address,
              phone number, university affiliation, and identity verification documents for provider accounts.
              We also collect usage data to improve our platform experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>
              We use your information to connect students with verified accommodation providers, process account
              verification, communicate about bookings and inquiries, and maintain platform security.
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Document Storage</h2>
            <p>
              National Registration Card images and verification documents uploaded by providers are stored securely
              and accessed only by authorised UniBoard administrators for verification purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Data Retention</h2>
            <p>
              We retain account information for as long as your account is active. You may request account deletion
              by contacting us at uniboard.zm@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Contact</h2>
            <p>
              For privacy-related questions, contact us at{' '}
              <a href="mailto:uniboard.zm@gmail.com" className="text-green-700 font-semibold hover:underline">
                uniboard.zm@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
