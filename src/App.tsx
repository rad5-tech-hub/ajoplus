import { BrowserRouter } from 'react-router-dom';
import AppRouter from './app/router/AppRouter';
// import { ThemeProvider } from './providers/ThemeProvider'; // will be created next

function App() {
  return (
    <BrowserRouter>
      {/* <ThemeProvider> */}
        <AppRouter />
      {/* </ThemeProvider> */}
    </BrowserRouter>
  );
}

export default App;