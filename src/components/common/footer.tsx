import React from "react";
import { Link, useLocation } from "react-router-dom";
import defaultLogo from "../../assets/images/misplaceme logo icon main@4x.png";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const hideFooterPaths = ["/login", "/register"];
  if (hideFooterPaths.includes(location.pathname)) return null;

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <img src={defaultLogo} alt="MisplaceMe logo" className="w-9 h-9 object-contain" />
              <div>
                <p role="heading" className="font-bold text-white text-base">MisplaceMe</p>
                <p className="text-gray-500 text-xs">Bells University of Technology</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              The official campus lost &amp; found board. Helping students and staff reclaim their belongings since day one.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-semibold text-white text-sm mb-3">Quick Links</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Admin Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-white text-sm mb-3">Contact</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 17" fill="none">
                  <path d="M9.1445 10.9569L8.73493 11.2862C8.73493 11.2862 7.76042 12.0682 6.06446 9.10916C4.3685 6.15013 5.34302 5.36817 5.34302 5.36817L5.60067 5.16006C6.23677 4.64996 6.47108 3.68132 6.15149 2.88094L5.49888 1.2462C5.10309 0.255397 4.03824 -0.0671961 3.25079 0.565153L1.83804 1.69888C1.44812 2.01308 1.14293 2.45645 1.06707 2.99886C0.873207 4.38732 0.842765 7.44643 3.1406 11.4568C5.57817 15.7091 8.48731 16.4101 9.7127 16.5053C10.1008 16.5356 10.4739 16.3709 10.799 16.1091L12.0769 15.0827C12.9406 14.3903 13.0097 12.9351 12.2141 12.1857L10.9769 11.0187C10.4546 10.5275 9.71141 10.5019 9.1445 10.9569Z" fill="#6B7280"/>
                </svg>
                +234 903 876 5498
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 15 12" fill="none">
                  <path d="M15 1.5C15 0.675 14.325 0 13.5 0H1.5C0.675 0 0 0.675 0 1.5V10.5C0 11.325 0.675 12 1.5 12H13.5C14.325 12 15 11.325 15 10.5V1.5ZM13.5 1.5L7.5 5.25L1.5 1.5H13.5ZM13.5 10.5H1.5V3L7.5 6.75L13.5 3V10.5Z" fill="#6B7280"/>
                </svg>
                info@blf.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {currentYear} MisplaceMe. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="#terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link to="#privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
