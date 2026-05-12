// src/features/landing/LandingPage.tsx

import Navbar from './components/NavBar';
import HeroSection from './sections/HeroSection';
import HowItWorksSection from './sections/HowItWorksSection';
import PackagesSection from './sections/PackagesSection';
import ProductsSection from './sections/ProductsSection';
import DailyAjoSection from './sections/DailyAjoSection';
import ReferralSection from './sections/ReferralSection';
import WhyChooseAbaGold from './sections/ChooseAjo';
// import Testimonies from './sections/Testimonies';
import Faq from './sections/Faq';
import ReadyToStartSaving from './sections/CtaSection';
import Footer from './components/Footer';

import Modal from '@/components/ui/GeneralModal';
import { AdSlot } from './components/AdSlot';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />

      {/* Ad slot 1 — shown between "How It Works" and "Packages" */}
      <AdSlot
        slotId="landing_after_how_it_works"
        className="px-4 sm:px-6 py-2"
      />

      <PackagesSection />
      <ProductsSection />

      {/* Ad slot 2 — shown between "Products" and "Daily Ajo" */}
      <AdSlot
        slotId="landing_after_products"
        className="px-4 sm:px-6 py-2"
      />

      <DailyAjoSection />
      <ReferralSection />

      {/* Ad slot 3 — shown between "Referral" and "Why Choose AbaGold" */}
      <AdSlot
        slotId="landing_after_referral"
        className="px-4 sm:px-6 py-2"
      />

      <WhyChooseAbaGold />
      {/* <Testimonies /> */}

      {/* Ad slot 4 — shown just before "FAQ" */}
      <AdSlot
        slotId="landing_before_faq"
        className="px-4 sm:px-6 py-2"
      />

      <Faq />
      <ReadyToStartSaving />
      <Footer />

      {/* Global modal — must stay at root of page */}
      <Modal />
    </div>
  );
};

export default LandingPage;