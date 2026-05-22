import React from 'react';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import { Shield, Users, MapPin, Heart, Award, CheckCircle } from 'lucide-react';

const team = [
  {
    name: 'Siame Christopher',
    role: 'Founder, UniBoard',
    bio: 'Started UniBoard after personally struggling to find safe student accommodation when joining Mukuba University. Driven to make housing easier and more transparent for every student.',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_14a5ca983-1763300171126.png",
    avatarAlt: 'Siame Christopher, Founder of UniBoard',
  },
  {
    name: 'Natasha Phiri',
    role: 'Co-Founder & CTO',
    bio: 'Software engineer and CBU alumna. Passionate about using technology to solve real problems for Zambian students.',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_11b3df0b3-1772952555612.png",
    avatarAlt: 'Natasha Phiri, CTO of UniBoard Zambia',
  },
  {
    name: 'Bupe Chanda',
    role: 'Head of Operations',
    bio: 'Manages provider verification and student support. Ensures every listing on UniBoard meets our quality standards.',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ec91ebef-1763301008266.png",
    avatarAlt: 'Bupe Chanda, Head of Operations at UniBoard',
  },
];


const values = [
{ icon: Shield, title: 'Trust First', desc: 'Every provider is manually verified before their first listing goes live. We visit properties and check documents.', color: 'bg-green-100 text-green-700' },
{ icon: Users, title: 'Student-Centred', desc: 'Every decision we make starts with one question: does this make life easier for Zambian students?', color: 'bg-blue-100 text-blue-700' },
{ icon: Heart, title: 'Community', desc: 'We are building a community of students and providers who support each other and share honest reviews.', color: 'bg-red-100 text-red-700' },
{ icon: Award, title: 'Quality', desc: 'We maintain high standards for listings. Inaccurate photos, misleading prices, or poor conditions get removed.', color: 'bg-amber-100 text-amber-700' }];


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Topbar />
      {/* Hero */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-3">About UniBoard</p>
            <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Born from a real student struggle,<br />
              <span className="text-green-700">built for every campus</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              In 2024, after being accepted to Mukuba University, our founder faced the same housing challenges many students still face today: unreliable contacts, social media chaos, scam risk, inflated agent fees, and uncertainty about where to stay.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              UniBoard was created to transform that experience into something secure, trusted, and easy. Our mission is simple: make student accommodation safer, easier, and more transparent so students can focus on learning, growth, and their future.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <CheckCircle size={18} className="text-green-600" />
                Founded in Kitwe, Zambia
              </div>
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <CheckCircle size={18} className="text-green-600" />
                Serving 6 universities
              </div>
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <CheckCircle size={18} className="text-green-600" />
                8,500+ students housed
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Mission */}
      <section className="py-16 bg-green-700">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-green-300 text-xs font-semibold tracking-widest uppercase mb-4">Our Mission</p>
            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-6">
              &ldquo;To make finding safe, affordable student accommodation in Zambia as easy as a Google search.&rdquo;
            </h2>
            <p className="text-green-200 text-base leading-relaxed">
              We believe every Zambian student deserves access to safe, verified accommodation near their campus — regardless of where they come from or how much they know about the city they are moving to.
            </p>
          </div>
        </div>
      </section>
      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
            { value: '1,240+', label: 'Active Bedspaces', color: 'text-green-700' },
            { value: '8,500+', label: 'Students Housed', color: 'text-amber-600' },
            { value: '340+', label: 'Verified Providers', color: 'text-green-600' },
            { value: '6', label: 'Universities Covered', color: 'text-blue-600' }]?.
            map((stat) =>
            <div key={stat?.label} className="text-center">
                <p className={`text-4xl font-bold font-mono ${stat?.color} mb-2`}>{stat?.value}</p>
                <p className="text-gray-500 text-sm">{stat?.label}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-2">What We Stand For</p>
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values?.map((v) =>
            <div key={v?.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className={`w-12 h-12 ${v?.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <v.icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v?.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v?.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-2">The People Behind UniBoard</p>
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {team?.map((member) =>
            <div key={member?.name} className="text-center">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 shadow-md">
                  <img src={member?.avatar} alt={member?.avatarAlt} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-900 mb-0.5">{member?.name}</h3>
                <p className="text-green-700 text-sm font-medium mb-2">{member?.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member?.bio}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Location */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <MapPin size={28} className="text-green-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-1">Founded by a Mukuba University student to solve student accommodation challenges</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Founded in Kitwe, Zambia. We serve students across Lusaka, Kitwe, Ndola, and Kabwe — with plans to expand to all major university towns in Zambia.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

}