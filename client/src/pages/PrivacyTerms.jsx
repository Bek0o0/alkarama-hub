import React from "react";

export default function PrivacyTerms() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="bg-white/90 rounded-2xl shadow-soft p-8 space-y-8">
        <header>
          <h1 className="text-4xl font-extrabold text-brandNavy text-center">
            Privacy Policy & Terms of Use
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Last updated: 23 Aug 2025
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-brandNavy">Privacy Policy</h2>
          <p className="text-textDark">
            Alkarama Hub is an academic prototype. We do not collect or process real personal data.
            Any information used during testing must be <strong>dummy/simulated</strong>. Do not
            submit sensitive or identifying information.
          </p>
          <ul className="list-disc list-inside text-textDark space-y-1">
            <li><strong>Accounts:</strong> Mock entries stored in a local JSON server.</li>
            <li><strong>Reports:</strong> Fictional data demonstrating submission, status, and visibility.</li>
            <li><strong>Files:</strong> Uploaded “invoices” / images are for demo only.</li>
            <li><strong>Storage:</strong> We use <code>localStorage</code> for role/email to support routing.</li>
            <li><strong>Retention:</strong> Test data will be removed before final submission.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-brandNavy">Terms of Use</h2>
          <ul className="list-disc list-inside text-textDark space-y-2">
            <li>Use only with dummy data; you’re responsible for any content you submit.</li>
            <li>This is not for emergencies or real fundraising.</li>
            <li>Admin features are restricted and for evaluation only.</li>
            <li>By using the system, you agree to these terms.</li>
          </ul>
        </section>

        <footer className="pt-4 border-t text-sm text-gray-600">
          For questions, contact the project owner/supervisor.
        </footer>
      </div>
    </div>
  );
}
