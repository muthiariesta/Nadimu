export default function Footer() {
  return (
    <footer className="py-10 px-8" style={{ background: "#7B1818" }}>
      <div className="max-w-4xl mx-auto">
        {/* Social / Contact row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
          {/* Instagram */}
          <div className="flex items-center gap-3 text-white">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="white" strokeWidth={0} />
            </svg>
            <span className="font-medium text-base">@nadimu</span>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-3 text-white">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span className="font-medium text-base">08123456789</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 text-white">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="font-medium text-base">nadimu@gmail.com</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mb-5" />

        {/* Copyright */}
        <p className="text-center text-white/80 text-sm">
          ©2026 Nadimu. Hak cipta dilindungi undang-undang.
        </p>
      </div>
    </footer>
  );
}
