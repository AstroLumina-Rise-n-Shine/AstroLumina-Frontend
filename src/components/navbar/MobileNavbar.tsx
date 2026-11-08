import React, { useState, useEffect, useRef } from "react";
import {
  NavbarProps,
  NavbarLogo,
  NavbarLinks,
} from "@/components/navbar/NavbarCommon";
import { getNavbarStyles } from "@/components/navbar/navbarStyles";
import { Menu, X } from "lucide-react";

const MobileNavbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const { mobileLinkClasses } = getNavbarStyles();

  const navClasses =
    "fixed top-4 left-[50%] -translate-x-[50%] z-50 w-full max-w-[92%] transition-all duration-500 ease-luxury bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-cosmic";
  const buttonClasses =
    "inline-flex items-center justify-center p-2 rounded-xl text-cosmic-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer";
  const mobileMenuClasses = `${isOpen ? "animate-slide-down" : "hidden"} md:hidden bg-white/5 backdrop-blur-xl border-t border-white/10 rounded-b-[2rem] py-2`;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <nav className={navClasses}>
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <NavbarLogo />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={buttonClasses}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Închide meniul" : "Deschide meniul"}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div ref={navbarRef} className={mobileMenuClasses}>
          <div className="px-4 py-3 space-y-1">
            <NavbarLinks linkClasses={mobileLinkClasses} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MobileNavbar;
