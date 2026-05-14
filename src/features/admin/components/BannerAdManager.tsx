import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { useAllAdverts, useCreateAdvert, useUpdateAdvert } from '@/app/store/BannerStore';

const BannerAdManager = () => {
  const { data: adsData, isLoading } = useAllAdverts();
  const createMutation = useCreateAdvert();
  const updateMutation = useUpdateAdvert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingAd = adsData?.ads?.[0] ?? null;

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [background, setBackground] = useState('linear-gradient(135deg, #059669 0%, #10b981 100%)');
  const [imagePreview, setImagePreview] = useState('');
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingAd) {
      setTitle(existingAd.title);
      setSubtitle(existingAd.subtitle);
      setButtonText(existingAd.buttonText);
      setButtonLink(existingAd.buttonLink);
      setBackground(existingAd.background);
      setImagePreview(existingAd.imageUrl);
      setIsActive(existingAd.isActive);
    }
  }, [existingAd]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
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
    setSaving(true);

    const payload: Partial<import('@/api/ads').Advert> = {
      title: title || 'Special Offer',
      subtitle,
      buttonText,
      buttonLink,
      background,
      isActive,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const mutate = existingAd
      ? updateMutation.mutateAsync({ id: existingAd.id, data: payload, imageFile: localFile ?? undefined })
      : createMutation.mutateAsync({ data: payload, imageFile: localFile ?? undefined });

    try {
      await mutate;
      setSaveMessage('Advertisement saved successfully!');
      setTimeout(() => setSaveMessage(null), 2500);
      setLocalFile(null);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save advertisement');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />;
  }

  const isPending = createMutation.isPending || updateMutation.isPending || saving;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-5">
          {existingAd ? 'Edit Advertisement' : 'Create Advertisement'}
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Summer Sale 2026"
              className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-600 rounded-2xl focus:outline-none text-sm" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtitle</label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Get up to 50% off on all items"
              className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-600 rounded-2xl focus:outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Button Text</label>
            <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)}
              placeholder="Shop Now"
              className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-600 rounded-2xl focus:outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Button Link</label>
            <input type="text" value={buttonLink} onChange={(e) => setButtonLink(e.target.value)}
              placeholder="https://example.com/sale"
              className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-600 rounded-2xl focus:outline-none text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Background (CSS gradient)</label>
            <input type="text" value={background} onChange={(e) => setBackground(e.target.value)}
              placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-600 rounded-2xl focus:outline-none text-sm font-mono text-xs" />
          </div>

          <div className="flex items-end pb-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 accent-emerald-600" />
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Banner Image</label>
            <div onClick={() => !isPending && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 text-center transition-colors cursor-pointer
                ${imagePreview ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-300 hover:border-emerald-400'}`}>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-28 rounded-2xl object-cover shadow-sm" />
                  <p className="text-xs text-slate-400 mt-2">Click to change image</p>
                  <button onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-red-500 text-white rounded-full text-sm leading-none hover:bg-red-600 transition-colors shadow-sm">×</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Upload banner image</p>
                  <p className="text-xs text-slate-400">PNG, JPG or WebP</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageSelect} className="hidden" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            {saveMessage && <p className="text-sm text-emerald-600 font-medium">{saveMessage}</p>}
            {saveError && <p className="text-sm text-red-600 font-medium">{saveError}</p>}
          </div>
          <div className="flex gap-3">
            {existingAd && (
              <button onClick={() => {
                setTitle(''); setSubtitle(''); setButtonText(''); setButtonLink('');
                setBackground('linear-gradient(135deg, #059669 0%, #10b981 100%)');
                setImagePreview(''); setLocalFile(null); setIsActive(true);
              }} className="border border-slate-300 text-slate-600 font-semibold px-4 py-3 rounded-2xl text-sm hover:bg-slate-50 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4 inline mr-1" /> Reset
              </button>
            )}
            <button onClick={handleSave} disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-all active:scale-[0.985] flex items-center gap-2 cursor-pointer">
              {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : existingAd ? 'Update Advertisement' : 'Create Advertisement'}
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Preview</h4>
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm" style={{ background: background || 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/5 rounded-full blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </div>
          {imagePreview && <img src={imagePreview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
          <div className="relative px-6 py-6 sm:px-8">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-white opacity-70" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white opacity-70">Promotional</span>
                </div>
                <p className="font-bold text-lg sm:text-xl text-white leading-tight">{title || 'Advertisement Title'}</p>
                {subtitle && <p className="text-sm text-white/80 mt-1 max-w-lg">{subtitle}</p>}
              </div>
              {buttonText && (
                <span className="flex-shrink-0 bg-white text-emerald-700 font-semibold text-sm px-5 py-2.5 rounded-2xl shadow-sm">
                  {buttonText}
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
