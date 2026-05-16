import { BrowserRouter } from 'react-router-dom';
import AppRouter from './app/router/AppRouter';
import ScrollToTop from './components/ui/ScrollToTop';
import AppErrorBoundary from './components/AppErrorBoundary';
import Modal from './components/ui/GeneralModal';

function App() {
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