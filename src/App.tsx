import { BrowserRouter } from 'react-router-dom';
import AppRouter from './app/router/AppRouter';
import ScrollToTop from './components/ui/ScrollToTop';

function App() {
  <ScrollToTop/>
  return (
    <BrowserRouter>
        <AppRouter />
    </BrowserRouter>
  );
}

export default App;