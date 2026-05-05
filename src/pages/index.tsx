import React from "react";
import backgroundImage from "../assets/images/9886321 2.png";
import ReportList from "../components/common/reportList";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 576 512" fill="currentColor">
        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
      </svg>
    ),
    title: "Browse Listings",
    desc: "Search and filter through all reported lost items on campus by category or location.",
  },
  {
    step: "02",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512" fill="currentColor">
        <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
      </svg>
    ),
    title: "Contact the Finder",
    desc: "Spot your item? Tap 'View Details' and call the contact number to arrange return.",
  },
  {
    step: "03",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512" fill="currentColor">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
      </svg>
    ),
    title: "Reclaim Your Property",
    desc: "Verify ownership and pick up your lost item. Reunited!",
  },
];

const STATS = [
  { value: "100+", label: "Items Listed" },
  { value: "Campus-Wide", label: "Coverage" },
  { value: "Free", label: "Service" },
];

const Index: React.FC = () => {
  const scrollToBrowse = () => {
    document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div data-testid="index-page">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-10 pt-16 pb-20 flex flex-col md:flex-row items-center gap-12">
          {/* Left copy */}
          <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
            {/* Badge */}
            <span className="inline-flex self-center md:self-start items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Bells University of Technology — Lost &amp; Found
            </span>

            <h1
              role="heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            >
              Lost something
              <br />
              <span className="text-yellow-300">on campus?</span>
            </h1>

            <p className="text-blue-100 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto md:mx-0">
              MisplaceMe is the official campus lost &amp; found board. Browse items reported by fellow students and staff — and get yours back.
            </p>

            {/* Stats row */}
            <div className="flex justify-center md:justify-start gap-8 pt-2">
              {STATS.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <p className="text-2xl font-bold text-yellow-300">{s.value}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
              <button
                onClick={scrollToBrowse}
                className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Browse Lost Items
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </button>
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                Admin Login
              </a>
            </div>
          </div>

          {/* Right image card */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-[380px]">
              <div className="absolute -inset-4 bg-white/10 rounded-[28px] blur-2xl" />
              <div className="relative bg-white/10 border border-white/20 backdrop-blur-md rounded-[24px] overflow-hidden shadow-2xl">
                <img
                  src={backgroundImage}
                  alt="Lost and Found"
                  className="w-full h-[340px] object-cover opacity-90"
                />
                <div className="p-4 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">Help reunite lost items</p>
                    <p className="text-blue-200 text-xs mt-0.5">Every item listed is waiting for its owner</p>
                  </div>
                  <div className="bg-emerald-400 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="white">
                      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 text-gray-50" >
            <path d="M0 60V30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-gray-50 pt-6 pb-14">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-10">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">How MisplaceMe Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-blue-400 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                    Step {step.step}
                  </span>
                </div>
                <div className="text-blue-600">{step.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Items listing ── */}
      <ReportList />
    </div>
  );
};

export default Index;
