import React from 'react';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-3">Legal</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

        <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using UniBoard, you agree to these Terms of Service. If you do not agree,
              please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Platform Role</h2>
            <p>
              UniBoard is a marketplace that connects students with accommodation providers. We verify provider
              documents but do not guarantee the condition of properties. Rental agreements are between students
              and providers directly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Provider Accounts</h2>
            <p>
              Provider accounts require identity verification and admin approval before listings go live. Providers
              must maintain accurate listing information, respond to inquiries promptly, and comply with local
              housing regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Student Accounts</h2>
            <p>
              Students must provide accurate registration information. Misuse of the platform, fraudulent inquiries,
              or harassment of providers may result in account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Limitation of Liability</h2>
            <p>
              UniBoard is not liable for disputes between students and providers, property conditions, or financial
              transactions conducted outside the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Contact</h2>
            <p>
              Questions about these terms? Email{' '}
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
