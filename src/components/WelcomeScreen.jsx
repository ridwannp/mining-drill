/**
 * Welcome screen when no blasting area is selected.
 */
const WelcomeScreen = ({ onCreateArea }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/20 flex items-center justify-center mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="8" r="4" />
            <line x1="12" y1="12" x2="12" y2="22" />
            <line x1="8" y1="17" x2="16" y2="17" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          Welcome to DrillOps
        </h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Manage drill hole measurements for blasting preparation.
          Create a blasting area to get started with your operation.
        </p>

        <button
          id="btn-welcome-create"
          onClick={onCreateArea}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold text-base hover:from-amber-500 hover:to-amber-400 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Blasting Area
        </button>

        {/* Feature hints */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-sky-400">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              ),
              label: 'Visual Grid',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-emerald-400">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              label: 'Track Progress',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-amber-400">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              ),
              label: 'Export Reports',
            },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center">
                {f.icon}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
