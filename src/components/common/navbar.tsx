import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import bellsLogo from "../../assets/images/bells-university-of-technology-logo-transparent 1.svg";
import defaultLogo from "../../assets/images/misplaceme logo icon main@4x.png";

interface NavbarProps {
  isNavbarOpen: boolean;
  handleNavClick: () => void;
}

interface NavbarMenuProps {
  menu: string;
  href: string;
}

interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export const universities = [
  {
    uni: "bells",
    logo: bellsLogo,
    email: "info@blf.com",
    phoneNumber: "+234 903 876 5498",
    socialMedia: {
      facebook: "https://facebook.com/bellsuniversity",
      twitter: "https://twitter.com/bellsuniversity",
      instagram: "https://instagram.com/bellsuniversity",
      linkedin: "https://linkedin.com/company/bellsuniversity",
    },
  },
  {
    uni: "babcock",
    logo: defaultLogo,
    email: "info@blf.com",
    phoneNumber: "+234 707 266 8014",
    socialMedia: {
      facebook: "https://facebook.com/babcockuniversity",
      twitter: "https://twitter.com/babcockuniversity",
      instagram: "https://instagram.com/babcockuniversity",
      linkedin: "https://linkedin.com/company/babcockuniversity",
    },
  },
];

const AUTH_PATHS = ["/login", "/register"];

const Navbar: React.FC<NavbarProps> = ({ isNavbarOpen, handleNavClick }) => {
  const [currentLogo, setCurrentLogo] = useState<string>("");
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [currentPhone, setCurrentPhone] = useState<string>("");
  const [currentSocialMedia, setCurrentSocialMedia] = useState<SocialMediaLinks>({});
  const location = useLocation();

  if (AUTH_PATHS.includes(location.pathname)) return null;

  const isAdminArea =
    location.pathname === "/home" ||
    location.pathname === "/reports" ||
    location.pathname === "/make-a-report";

  const navbarMenu: NavbarMenuProps[] = [
    { menu: "Home", href: isAdminArea ? "/home" : "/" },
    ...(isAdminArea
      ? [
          { menu: "Reports", href: "/reports" },
          { menu: "Add Item", href: "/make-a-report" },
        ]
      : [{ menu: "About Us", href: "/about-us" }]),
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const userUniversity = "bells";
      const currentUniversity = universities.find((uni) => uni.uni === userUniversity);
      if (currentUniversity) {
        setCurrentLogo(currentUniversity.logo);
        setCurrentEmail(currentUniversity.email);
        setCurrentPhone(currentUniversity.phoneNumber);
        setCurrentSocialMedia(currentUniversity.socialMedia);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
  };

  const isMenuActive = "text-blue-600 border-b-blue-600";

  return (
    <nav
      data-testid="navbar"
      data-navbar-open={isNavbarOpen}
      className="sticky top-0 z-30 py-3 sm:py-4 px-4 md:px-10 bg-white border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-[1300px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to={isAdminArea ? "/home" : "/"} className="flex items-center gap-2.5">
          <span className="sr-only">University Logo</span>
          <img
            src={currentLogo}
            alt="University Logo"
            width={100}
            height={90}
            className="w-9 h-9 lg:w-12 lg:h-12 rounded-full object-contain"
            aria-required
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-extrabold text-lg text-gray-900">MisplaceMe</span>
            <span className="text-xs text-gray-400 font-medium -mt-0.5">Bells University</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-1 items-center">
          <span className="sr-only">Desktop and Tablet Menu</span>
          {navbarMenu.map((menu, index) => {
            const isActive = location.pathname === menu.href;
            return (
              <Link
                key={index}
                to={menu.href}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {menu.menu}
              </Link>
            );
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {isAdminArea ? (
            <Link to="/">
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18" fill="none">
                  <path d="M1.0835 9.00004C1.0835 5.26837 1.0835 3.40171 2.24266 2.24254C3.40183 1.08337 5.26766 1.08337 9.00016 1.08337C12.7318 1.08337 14.5985 1.08337 15.7577 2.24254C16.9168 3.40171 16.9168 5.26754 16.9168 9.00004C16.9168 12.7317 16.9168 14.5984 15.7577 15.7575C14.5985 16.9167 12.7327 16.9167 9.00016 16.9167C5.2685 16.9167 3.40183 16.9167 2.24266 15.7575C1.0835 14.5984 1.0835 12.7325 1.0835 9.00004Z" stroke="#374151" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.1976 9.02343H7.38509M7.38509 9.02343C7.38509 9.49843 9.18092 11.0959 9.18092 11.0959M7.38509 9.02343C7.38509 8.5351 9.18092 6.96926 9.18092 6.96926M4.86426 5.6626V12.3293" stroke="#374151" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"/>
                </svg>
                Admin Login
              </button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={handleNavClick}
            className="block md:hidden cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isNavbarOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L17 17M17 1L1 17" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg data-testid="hamburger-menu" width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.0683594 1.50454C0.0683594 1.14162 0.362565 0.847412 0.725486 0.847412H16.4965C16.8594 0.847412 17.1536 1.14162 17.1536 1.50454C17.1536 1.86746 16.8594 2.16166 16.4965 2.16166H0.725486C0.362565 2.16166 0.0683594 1.86746 0.0683594 1.50454ZM0.0683594 7.63772C0.0683594 7.2748 0.362565 6.98059 0.725486 6.98059H16.4965C16.8594 6.98059 17.1536 7.2748 17.1536 7.63772C17.1536 8.00064 16.8594 8.29484 16.4965 8.29484H0.725486C0.362565 8.29484 0.0683594 8.00064 0.0683594 7.63772ZM0.725486 13.1138C0.362565 13.1138 0.0683594 13.408 0.0683594 13.7709C0.0683594 14.1338 0.362565 14.428 0.725486 14.428H16.4965C16.8594 14.428 17.1536 14.1338 17.1536 13.7709C17.1536 13.408 16.8594 13.1138 16.4965 13.1138H0.725486Z" fill="black"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-out menu */}
      {isNavbarOpen && (
        <nav className="fixed inset-0 bg-black/40 z-40" onClick={handleNavClick}>
          <div
            className="absolute top-0 right-0 bottom-0 w-[300px] bg-white flex flex-col justify-between py-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div
                onClick={handleNavClick}
                data-testid="close-menu"
                className="flex justify-end px-5 mb-6 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#374151"/>
                </svg>
              </div>

              <div className="px-5 mb-6">
                <div className="flex items-center gap-2.5">
                  <img src={currentLogo} alt="Logo" className="w-9 h-9 rounded-full object-contain" />
                  <div>
                    <p className="font-bold text-gray-900">MisplaceMe</p>
                    <p className="text-xs text-gray-400">Bells University</p>
                  </div>
                </div>
              </div>

              <ul className="flex flex-col px-3">
                <span className="sr-only">Mobile Menu</span>
                {navbarMenu.map((menu, index) => {
                  const isActive = location.pathname === menu.href;
                  return (
                    <Link
                      key={index}
                      to={menu.href}
                      onClick={handleNavClick}
                      className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        isActive
                          ? `${isMenuActive} bg-blue-50`
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {menu.menu}
                    </Link>
                  );
                })}

                {isAdminArea && (
                  <Link
                    to="/"
                    onClick={handleNavClick}
                    className="px-4 py-3 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Logout
                  </Link>
                )}
              </ul>
            </div>

            <div className="flex flex-col gap-6 px-5">
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-sm text-gray-700">Contact us</p>
                <span className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                    <path d="M9.1445 10.9569L8.73493 11.2862C8.73493 11.2862 7.76042 12.0682 6.06446 9.10916C4.3685 6.15013 5.34302 5.36817 5.34302 5.36817L5.60067 5.16006C6.23677 4.64996 6.47108 3.68132 6.15149 2.88094L5.49888 1.2462C5.10309 0.255397 4.03824 -0.0671961 3.25079 0.565153L1.83804 1.69888C1.44812 2.01308 1.14293 2.45645 1.06707 2.99886C0.873207 4.38732 0.842765 7.44643 3.1406 11.4568C5.57817 15.7091 8.48731 16.4101 9.7127 16.5053C10.1008 16.5356 10.4739 16.3709 10.799 16.1091L12.0769 15.0827C12.9406 14.3903 13.0097 12.9351 12.2141 12.1857L10.9769 11.0187C10.4546 10.5275 9.71141 10.5019 9.1445 10.9569Z" fill="#0D99FF"/>
                  </svg>
                  {currentPhone}
                </span>
                <span className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15 12" fill="none">
                    <path d="M15 1.5C15 0.675 14.325 0 13.5 0H1.5C0.675 0 0 0.675 0 1.5V10.5C0 11.325 0.675 12 1.5 12H13.5C14.325 12 15 11.325 15 10.5V1.5ZM13.5 1.5L7.5 5.25L1.5 1.5H13.5ZM13.5 10.5H1.5V3L7.5 6.75L13.5 3V10.5Z" fill="#0D99FF"/>
                  </svg>
                  {currentEmail}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-semibold text-sm text-gray-700">Follow us</p>
                <div className="flex items-center gap-4">
                  {currentSocialMedia.facebook && (
                    <a href={currentSocialMedia.facebook} target="_blank" rel="noopener noreferrer" data-testid="social-media-link">
                      <FaFacebook className="text-blue-600 hover:text-blue-800" size={20} />
                    </a>
                  )}
                  {currentSocialMedia.twitter && (
                    <a href={currentSocialMedia.twitter} target="_blank" rel="noopener noreferrer" data-testid="social-media-link">
                      <FaTwitter className="text-blue-400 hover:text-blue-600" size={20} />
                    </a>
                  )}
                  {currentSocialMedia.instagram && (
                    <a href={currentSocialMedia.instagram} target="_blank" rel="noopener noreferrer" data-testid="social-media-link">
                      <FaInstagram className="text-pink-500 hover:text-pink-700" size={20} />
                    </a>
                  )}
                  {currentSocialMedia.linkedin && (
                    <a href={currentSocialMedia.linkedin} target="_blank" rel="noopener noreferrer" data-testid="social-media-link">
                      <FaLinkedin className="text-blue-700 hover:text-blue-900" size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
    </nav>
  );
};

export default Navbar;
