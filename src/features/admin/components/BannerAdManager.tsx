import { useState, useRef } from 'react';
import { Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { useBanner, useUpdateBanner } from '@/app/store/BannerStore';

const BannerAdManager = () => {
  const { data: banner, isLoading } = useBanner();
  const updateMutation = useUpdateBanner();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [bgColor, setBgColor] = useState('from-emerald-600 to-emerald-500');
  const [imagePreview, setImagePreview] = useState('');
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!initialized && banner) {
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setCtaText(banner.ctaText);
    setCtaLink(banner.ctaLink);
    setBgColor(banner.backgroundColor);
    setImagePreview(banner.imageUrl);
    setIsActive(banner.isActive);
    setInitialized(true);
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview('');
    setLocalFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    setSaveMessage(null);
    setSaveError(null);
    setUploading(false);

    let imageUrl = imagePreview;

    // If there's a local file that hasn't been uploaded yet
    if (localFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', localFile);
        const response = await fetch('/api/banner/upload', {
          method: 'POST',
          body: formData,
        });
        const json = await response.json();
        if (json.success && json.data?.imageUrl) {
          imageUrl = json.data.imageUrl;
        } else {
          // fallback: use local preview (backend upload not ready)
          imageUrl = imagePreview;
        }
      } catch {
        // Backend upload endpoint not available — keep local preview
        imageUrl = imagePreview;
      }
      setUploading(false);
      setLocalFile(null);
    }

    updateMutation.mutate(
      {
        title,
        subtitle,
        ctaText,
        ctaLink,
        backgroundColor: bgColor,
        imageUrl,
        isActive,
      },
      {
        onSuccess: () => {
          setSaveMessage('Banner saved successfully!');
          setTimeout(() => setSaveMessage(null), 2500);
        },
        onError: (err: Error) => {
          setSaveError(err.message || 'Failed to save banner');
        },
      }
    );
  };

  if (isLoading) {
    return <div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-5">Promotional Banner</h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Banner Title</label>
            <input
              type="text" value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Secure your family's future with AbaGold Premium"
              className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-600 rounded-2xl focus:outline-none text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtitle</label>
            <input
              type="text" value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Earn up to 18% annual returns on your locked savings plans."
              className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-600 rounded-2xl focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Button Text</label>
            <input
              type="text" value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Learn More"
              className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-600 rounded-2xl focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Button Link</label>
            <input
              type="text" value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="/browse"
              className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-600 rounded-2xl focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Background</label>
            <select
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-600 rounded-2xl focus:outline-none text-sm bg-white"
            >
              <option value="from-emerald-600 to-emerald-500">Emerald Green</option>
              <option value="from-blue-600 to-blue-500">Blue</option>
              <option value="from-purple-600 to-purple-500">Purple</option>
              <option value="from-amber-600 to-orange-500">Amber / Orange</option>
              <option value="from-slate-800 to-slate-700">Dark Slate</option>
              <option value="from-rose-600 to-pink-500">Rose / Pink</option>
            </select>
          </div>

          <div className="flex items-end pb-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 accent-emerald-600"
              />
              <span className="text-sm font-medium text-slate-700">Banner Visible</span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Background Image (Optional)</label>
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 text-center transition-colors cursor-pointer
                ${imagePreview ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-300 hover:border-emerald-400'}`}
            >
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-28 rounded-2xl object-cover shadow-sm" />
                  <p className="text-xs text-slate-400 mt-2">Click to change image</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-red-500 text-white rounded-full text-sm leading-none hover:bg-red-600 transition-colors shadow-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Upload banner image</p>
                  <p className="text-xs text-slate-400">PNG, JPG or WebP — recommended 1200×400px</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            {saveMessage && <p className="text-sm text-emerald-600 font-medium">{saveMessage}</p>}
            {saveError && <p className="text-sm text-red-600 font-medium">{saveError}</p>}
            {uploading && <p className="text-sm text-slate-500 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Uploading image...</p>}
          </div>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending || uploading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-all active:scale-[0.985] flex items-center gap-2 cursor-pointer"
          >
            {(updateMutation.isPending || uploading) ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : 'Save Banner'}
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Preview</h4>
        <div className={`relative w-full bg-gradient-to-r ${bgColor} rounded-2xl overflow-hidden shadow-sm`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/5 rounded-full blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </div>
          {imagePreview && (
            <img src={imagePreview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          )}
          <div className="relative px-6 py-6 sm:px-8">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-white opacity-70" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white opacity-70">Promotional</span>
                </div>
                <p className="font-bold text-lg sm:text-xl text-white leading-tight">{title || 'Banner Title'}</p>
                {subtitle && <p className="text-sm text-white/80 mt-1 max-w-lg">{subtitle}</p>}
              </div>
              {ctaText && (
                <span className="flex-shrink-0 bg-white text-emerald-700 font-semibold text-sm px-5 py-2.5 rounded-2xl shadow-sm inline-flex items-center gap-1.5">
                  {ctaText}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAdManager;
