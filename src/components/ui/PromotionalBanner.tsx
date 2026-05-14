import { useState } from 'react';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { useActiveAdvert } from '@/app/store/BannerStore';

const PromotionalBanner = () => {
  const { data: ad } = useActiveAdvert();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !ad || !ad.isActive) return null;

  const bgStyle = ad.background
    ? { background: ad.background }
    : { background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative w-full rounded-3xl overflow-hidden shadow-lg" style={bgStyle}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg" />
        </div>

        {ad.imageUrl && (
          <img
            src={ad.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}

        <div className="relative px-6 py-8 sm:px-10 sm:py-10 md:py-12">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-white opacity-80" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white opacity-80">
                  Promotional
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-white">
                {ad.title}
              </h2>
              {ad.subtitle && (
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/90 max-w-xl">
                  {ad.subtitle}
                </p>
              )}
            </div>
            {ad.buttonText && ad.buttonLink && (
              <a
                href={ad.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-amber-700 font-semibold text-sm px-6 py-3 rounded-2xl hover:bg-amber-50 active:scale-[0.97] transition-all duration-200 shadow-md cursor-pointer"
              >
                {ad.buttonText}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          className="absolute top-3 right-3 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/15 transition-all duration-150 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PromotionalBanner;
