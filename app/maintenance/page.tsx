import React from 'react';

export const metadata = {
  title: 'System Maintenance | Corplex Global Accounting',
  description: 'We are currently undergoing scheduled maintenance to improve our services.',
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A2540] text-white relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#12365A] rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A44C]/10 rounded-full blur-[100px] opacity-50 translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      
      <header className="relative z-20 w-full p-6 sm:p-10 flex justify-center sm:justify-start">
        <div className="flex items-center gap-3">
          <img
            src="/corplex-mark.png"
            alt="Corplex Global Accounting logo"
            className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
          />
          <span className="hidden h-12 w-px bg-[#C9A44C]/60 sm:block" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold tracking-[0.26em] sm:text-base text-white">
              CORPLEX GLOBAL
            </span>
            <span className="block text-[11px] uppercase tracking-[0.28em] text-[#C9A44C]">
              Accounting & Tax Consultancy
            </span>
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center relative z-10 px-6 py-12">
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center text-center">
          <div className="mb-10 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#C9A44C]/20 rounded-full blur-xl animate-pulse" />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-20 h-20 text-[#C9A44C] animate-[spin_6s_linear_infinite] drop-shadow-[0_0_15px_rgba(201,164,76,0.4)] relative z-10" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white drop-shadow-sm">
            Scheduled Maintenance
          </h1>
          <p className="text-lg md:text-xl text-[#F5F7FA]/80 mb-12 leading-relaxed max-w-xl mx-auto font-medium">
            We are currently upgrading our systems to provide you with an even more seamless and secure experience. Corplex Global will be back online shortly.
          </p>
          <div className="flex gap-3 items-center justify-center bg-[#12365A]/50 px-8 py-4 rounded-full border border-white/5 shadow-lg backdrop-blur-md">
            <span className="text-sm font-semibold tracking-widest uppercase text-[#C9A44C] mr-2 hidden sm:inline">System Status</span>
            <div className="w-2.5 h-2.5 bg-[#C9A44C] rounded-full animate-[bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 bg-[#C9A44C] rounded-full animate-[bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '160ms' }} />
            <div className="w-2.5 h-2.5 bg-[#C9A44C] rounded-full animate-[bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '320ms' }} />
          </div>
        </div>
      </main>

      <footer className="relative z-20 w-full p-6 text-center text-sm text-[#F5F7FA]/50 border-t border-white/5">
        &copy; {new Date().getFullYear()} Corplex Global Accounting. All rights reserved.
      </footer>
    </div>
  );
}
