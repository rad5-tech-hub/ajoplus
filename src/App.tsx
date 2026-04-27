import { BrowserRouter } from 'react-router-dom';
import AppRouter from './app/router/AppRouter';
import ScrollToTop from './components/ui/ScrollToTop';
import AppErrorBoundary from './components/AppErrorBoundary';

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <AppRouter />
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;