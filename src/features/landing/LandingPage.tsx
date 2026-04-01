// src/features/landing/LandingPage.tsx
import Navbar from './components/NavBar';
import HeroSection from './sections/HeroSection';
import HowItWorksSection from './sections/HowItWorksSection';
import PackagesSection from './sections/PackagesSection';
import ProductsSection from './sections/ProductsSection';
import DailyAjoSection from './sections/DailyAjoSection';
import ReferralSection from './sections/ReferralSection';
import WhyChooseAjoPlus from './sections/ChooseAjo';
import Testimonies from './sections/Testimonies';
import Faq from './sections/Faq';
import ReadyToStartSaving from './sections/CtaSection';
import Footer from './components/Footer';
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <HeroSection />
	    <HowItWorksSection />
      <PackagesSection />
      <ProductsSection />
      <DailyAjoSection />
      <ReferralSection />
      <WhyChooseAjoPlus />
      <Testimonies />
      <Faq />
      <ReadyToStartSaving />
      <Footer />
    </div>
  );
};

export default LandingPage;