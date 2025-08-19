import React from "react";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <div className="bg-white/90 shadow-xl rounded-2xl p-10">
        <h1 className="text-4xl font-extrabold text-primary mb-8 text-center">
          About Alkarama Hub
        </h1>

        <p className="text-textDark text-lg leading-relaxed mb-8">
          <strong>Alkarama Hub</strong> is a civic technology initiative built to support Sudan’s recovery and nation-building efforts in the aftermath of conflict. The platform serves two main groups: Sudanese citizens on the ground who need a safe and reliable way to report local issues, and members of the Sudanese diaspora who want to contribute their skills and knowledge toward rebuilding their homeland.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-3">Our Mission</h2>
          <p className="text-textDark text-base leading-relaxed">
            Our mission is to strengthen transparency, collaboration, and participation by offering a secure web-based environment where people can report corruption, security threats, health emergencies, and infrastructure needs. At the same time, we help bridge the gap between skilled diaspora professionals and verified initiatives on the ground in Sudan.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-3">Key Features</h2>
          <ul className="list-disc list-inside text-textDark text-base leading-relaxed space-y-1">
            <li>Anonymous civic reporting with role-based moderation tools.</li>
            <li>Registration and profiling system for diaspora professionals.</li>
            <li>Admin dashboard for report management and data analysis.</li>
            <li>Multilingual and responsive design accessible across devices.</li>
            <li>Privacy-first architecture using modern web technologies.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-3">Technology Stack</h2>
          <p className="text-textDark text-base">
            Alkarama Hub is developed using a modern MERN-inspired stack:
          </p>
          <ul className="list-disc list-inside text-textDark ml-4 mt-2 space-y-1">
            <li>Frontend: React.js + Tailwind CSS</li>
            <li>Backend: Node.js with Express</li>
            <li>Database: PostgreSQL</li>
            <li>Authentication: Firebase Auth</li>
            <li>Hosting: Vercel (frontend) & Render (backend)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-3">Why It Matters</h2>
          <p className="text-textDark text-base leading-relaxed">
            Sudan is currently undergoing a critical transition. Rebuilding public trust and ensuring efficient coordination between civil society, diaspora, and humanitarian actors is essential. Alkarama Hub provides a scalable, digital foundation for enabling decentralized civic engagement and national recovery.
          </p>
        </section>

        <div className="border-t pt-6 text-sm text-gray-500">
          <p>
            <strong>Note:</strong> This platform is still in development as part of a postgraduate research project and is not yet available for public use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
