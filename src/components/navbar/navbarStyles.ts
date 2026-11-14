export const getNavbarStyles = () => {
  return {
    navClasses:
      "fixed top-4 left-[50%] -translate-x-[50%] z-50 w-full max-w-[92%] transition-all duration-500 ease-luxury bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-cosmic hover:border-white/20 hover:shadow-lg",
    linkClasses:
      "relative text-cosmic-200 hover:text-white px-5 py-2.5 rounded-xl text-base font-medium transition-all duration-400 ease-luxury cursor-pointer group overflow-hidden",
    mobileLinkClasses:
      "text-cosmic-200 hover:text-white block px-5 py-3 rounded-xl text-lg font-medium transition-all duration-400 ease-luxury cursor-pointer",
    logoClasses:
      "font-display text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white via-cosmic-300 to-gold-400 hover:text-white transition-all duration-500 ease-luxury cursor-pointer",
  };
};
