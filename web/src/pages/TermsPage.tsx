import type { FC } from 'react';

const TermsPage: FC = () => (
  <main className="landing-page py-14">
    <article className="container-page card-surface safe-prose p-8 sm:p-10">
      <p className="section-kicker">Terms & Conditions</p>
      <h1 className="mt-2 text-4xl">UniBoard platform rules</h1>
      <h2 className="mt-8 text-2xl">Landlord responsibilities</h2>
      <p>Landlords must provide accurate property details, real availability, correct pricing, and legitimate ownership or authorization information.</p>
      <h2 className="mt-8 text-2xl">Fake listing rules</h2>
      <p>Fake, misleading, duplicate, or scam listings are not allowed. UniBoard may remove listings and suspend accounts that put students at risk.</p>
      <h2 className="mt-8 text-2xl">Suspension and moderation</h2>
      <p>UniBoard reserves the right to moderate reports, ban users, disable landlord accounts, and delete fake listings to protect students and platform trust.</p>
    </article>
  </main>
);

export default TermsPage;
