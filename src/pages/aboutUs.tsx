import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import MisplaceMeLogo from "../assets/images/misplaceme logo icon main@4x.png";
import { universities } from "../components/common/navbar";

interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Item Goes Missing",
    description:
      "Someone loses an item on campus. A finder picks it up and hands it to the admin, or the owner notices it's gone.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-7 h-7" fill="currentColor">
        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
      </svg>
    ),
    color: "bg-blue-50 text-blue-600",
  },
  {
    step: "02",
    title: "Admin Posts Report",
    description:
      "The campus admin logs in and creates a detailed post — photo, description, location, category, and contact info.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-7 h-7" fill="currentColor">
        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
      </svg>
    ),
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    step: "03",
    title: "Community Browses",
    description:
      "Students and staff visit the public board to search by category, location, or keyword — no login required.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-7 h-7" fill="currentColor">
        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
      </svg>
    ),
    color: "bg-purple-50 text-purple-600",
  },
  {
    step: "04",
    title: "Owner Contacts Admin",
    description:
      "The rightful owner spots their item and contacts the admin using the phone number shown on the report.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-7 h-7" fill="currentColor">
        <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
      </svg>
    ),
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    step: "05",
    title: "Item Reunited",
    description:
      "After identity verification the item is returned, and the admin marks the report as resolved.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-7 h-7" fill="currentColor">
        <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
      </svg>
    ),
    color: "bg-red-50 text-red-500",
  },
];

const VALUES = [
  {
    title: "Integrity",
    description: "Every report is handled honestly. We never share personal contact details beyond what's needed to reunite an item with its owner.",
    emoji: "🛡️",
  },
  {
    title: "Empathy",
    description: "We know that behind every report is a person who cares. We treat each case with the urgency and sensitivity it deserves.",
    emoji: "🤝",
  },
  {
    title: "Transparency",
    description: "The public board is open to everyone — no account, no paywall. Lost and found information belongs to the whole campus community.",
    emoji: "🔍",
  },
];

const AboutUs: React.FC = () => {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [currentPhone, setCurrentPhone] = useState<string>("");
  const [currentSocialMedia, setCurrentSocialMedia] = useState<SocialMediaLinks>({});

  useEffect(() => {
    const currentUniversity = universities.find((uni) => uni.uni === "bells");
    if (currentUniversity) {
      setCurrentEmail(currentUniversity.email);
      setCurrentPhone(currentUniversity.phoneNumber);
      setCurrentSocialMedia(currentUniversity.socialMedia);
    }
  }, []);

  return (
    <div data-testid="about-us-page" className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="inline-block text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full mb-5">
              Bells University · MisplaceMe
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Reconnecting<br />What's Lost
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-xl mb-8">
              MisplaceMe is the official lost-and-found board for Bells University of Technology.
              We make it easy to report missing items, browse what's been found, and get
              things back where they belong.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-50 transition-colors shadow"
              >
                Browse Lost Items
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl text-sm hover:bg-white/30 transition-colors border border-white/30"
              >
                Admin Login
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="w-52 h-52 rounded-full bg-white/15 flex items-center justify-center shadow-2xl ring-4 ring-white/30">
              <img src={MisplaceMeLogo} alt="MisplaceMe" className="w-36 h-36 object-contain" />
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="overflow-hidden leading-[0]">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 fill-gray-50">
            <path d="M0,32 C360,80 1080,-16 1440,32 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
          <p className="text-gray-500 mt-2 text-sm">From missing to matched — five simple steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                {s.icon}
              </div>
              <span className="text-xs font-bold text-gray-300 tracking-widest">STEP {s.step}</span>
              <h3 className="text-base font-bold text-gray-900 mt-1 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="bg-white border-t border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Values</h2>
            <p className="text-gray-500 mt-2 text-sm">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                <div className="text-4xl mb-4">{v.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Get In Touch</h2>
              <div className="space-y-4">
                <a href={`tel:${currentPhone}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 text-blue-600 fill-current">
                      <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium text-sm group-hover:text-blue-600 transition-colors">{currentPhone}</span>
                </a>
                <a href={`mailto:${currentEmail}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 text-blue-600 fill-current">
                      <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium text-sm group-hover:text-blue-600 transition-colors">{currentEmail}</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Follow Us</h3>
              <div className="flex gap-3">
                {currentSocialMedia.facebook && (
                  <a href={currentSocialMedia.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <FaFacebook className="text-blue-600" size={18} />
                  </a>
                )}
                {currentSocialMedia.twitter && (
                  <a href={currentSocialMedia.twitter} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <FaTwitter className="text-blue-400" size={18} />
                  </a>
                )}
                {currentSocialMedia.instagram && (
                  <a href={currentSocialMedia.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
                    <FaInstagram className="text-pink-500" size={18} />
                  </a>
                )}
                {currentSocialMedia.linkedin && (
                  <a href={currentSocialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <FaLinkedin className="text-blue-700" size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
