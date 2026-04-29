// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  let pathname;
  try {
    // useLocation can fail if called outside Router context during initialization
    // This try-catch ensures the component doesn't crash the app
    const location = useLocation();
    pathname = location.pathname;
  } catch (error) {
    // If useLocation fails, just return null safely
    return null;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;