import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppRouter from './app/router/AppRouter';
import ScrollToTop from './components/ui/ScrollToTop';
import AppErrorBoundary from './components/AppErrorBoundary';
import Modal from './components/ui/GeneralModal';

function App() {
  useEffect(() => {
    const preventWheelChange = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'number') {
        e.preventDefault();
      }
    };
    document.addEventListener('wheel', preventWheelChange, { passive: false });
    return () => document.removeEventListener('wheel', preventWheelChange);
  }, []);

  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <AppRouter />
        <Modal />
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;