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
import PromotionalBanner from '@/components/ui/PromotionalBanner';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />

      {/* Single promotional banner — managed via admin panel */}
      <PromotionalBanner />

      <PackagesSection />
      <ProductsSection />
      <DailyAjoSection />
      <ReferralSection />
      <WhyChooseAbaGold />
      <Faq />
      <ReadyToStartSaving />
      <Footer />

      {/* Global modal — must stay at root of page */}
      <Modal />
    </div>
  );
};

export default LandingPage;