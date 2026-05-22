import type { FC } from 'react';

const PrivacyPolicyPage: FC = () => (
  <main className="landing-page py-14">
    <article className="container-page card-surface safe-prose p-8 sm:p-10">
      <p className="section-kicker">Privacy Policy</p>
      <h1 className="mt-2 text-4xl">How UniBoard protects your information</h1>
      <h2 className="mt-8 text-2xl">Collected data</h2>
      <p>We collect account information such as name, phone number, email address, role, listing details, booking activity, and support messages needed to run the platform.</p>
      <h2 className="mt-8 text-2xl">NRC handling</h2>
      <p>Landlord NRC documents are used only for verification and are not publicly displayed. Access is limited to authorized admin review workflows.</p>
      <h2 className="mt-8 text-2xl">Privacy protection</h2>
      <p>We use authentication, role-based access, and moderation controls to protect accounts and reduce scams, fake listings, and misuse.</p>
    </article>
  </main>
);

export default PrivacyPolicyPage;
