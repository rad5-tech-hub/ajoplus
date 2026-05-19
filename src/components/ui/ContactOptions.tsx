import { MessageCircle, Mail, Phone, X } from 'lucide-react';

interface ContactOptionsProps {
  onClose?: () => void;
}

export function ContactOptions({ onClose }: ContactOptionsProps) {
  const CONTACT_CONFIG = {
    whatsapp: '',
    email: '',
    phone: '',
  };

  return (
    <div className="relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="flex flex-col gap-3">
        <a
          href={`https://wa.me/${CONTACT_CONFIG.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium hover:bg-green-100 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
        </a>
        <a
          href={`mailto:${CONTACT_CONFIG.email}`}
          className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-medium hover:bg-blue-100 transition-all"
        >
          <Mail className="w-5 h-5" />
          Send an Email
        </a>
        <a
          href={`tel:${CONTACT_CONFIG.phone}`}
          className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 font-medium hover:bg-amber-100 transition-all"
        >
          <Phone className="w-5 h-5" />
          Call Us
        </a>
      </div>
    </div>
  );
}
