import React from "react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white/90 shadow-soft rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="Sudan Emblem" className="w-8 h-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-brandNavy">About Alkarama Hub</h1>
        </div>

        <p className="text-gray-800">
          <strong>Alkarama Hub</strong> is a civic platform built to help Sudanese communities surface issues safely,
          coordinate skilled diaspora support, and channel resources to verified local projects. The idea emerged in
          response to the widespread destruction and social disruption caused by the conflict, and a desire to
          support recovery through practical, accountable steps.
        </p>

        <h2 className="section-title mt-10">Why this platform</h2>
        <p className="text-gray-800">
          During and after the crisis, communities reported damaged hospitals, schools, power and water networks, and
          displaced families in urgent need. Many Sudanese professionals abroad want to help but lack a trusted,
          structured way to connect. Alkarama Hub provides:
        </p>
        <ul className="list-disc pl-6 text-gray-800 mt-3 space-y-2">
          <li><strong>Civic reporting</strong> with clear statuses to track issues and outcomes.</li>
          <li><strong>Rebuilding projects</strong> curated with transparent summaries and progress.</li>
          <li><strong>Diaspora registry</strong> so professionals can offer expertise and availability.</li>
          <li><strong>Public awareness</strong> where appropriate: selected reports may be published to inform communities.</li>
        </ul>

        <h2 className="section-title mt-10">How it works</h2>
        <ul className="list-disc pl-6 text-gray-800 mt-3 space-y-2">
          <li>Residents submit reports (optionally anonymous). Admins triage as <em>Pending</em>, <em>Resolved</em>, <em>Declined</em> or <em>Public</em>.</li>
          <li>Projects list the need, estimated cost, tags, and progress. Users can donate or register interest to volunteer.</li>
          <li>Professionals create a profile and get matched to relevant projects based on expertise.</li>
        </ul>

        <h2 className="section-title mt-10">Privacy & Ethics</h2>
        <p className="text-gray-800">
          This is an <strong>academic prototype</strong>. We avoid collecting sensitive personal data.
          Where identity documents are optionally provided, we store only hashed values and a short “last‑4”
          segment to support verification. Please use caution and avoid uploading sensitive details.
        </p>

        <h2 className="section-title mt-10">A note of thanks</h2>
        <p className="text-gray-800">
          The platform is inspired by the resilience of Sudanese communities and the commitment of the diaspora. Our
          goal is to make collaboration easier, safer, and more effective as recovery efforts continue.
        </p>
      </div>
    </div>
  );
}
