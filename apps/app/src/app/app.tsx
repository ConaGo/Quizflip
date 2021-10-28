import { Route, Link } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { NavBar } from '../components/NavBar';
import { lightTheme, darkTheme } from '../styles/muiTheme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from '../hooks/useAuth';

const queryClient = new QueryClient();
const Routing = () => {
  return (
    <>
      <NavBar />
      <Route
        path="/"
        exact
        render={() => (
          <div>
            This is the generated root route.{' '}
            <Link to="/page-2">Click here for page 2.</Link>
          </div>
        )}
      />
      <Route
        path="/create"
        exact
        render={() => (
          <div>
            <Link to="/">Click here to go back toCREATE root page.</Link>
          </div>
        )}
      />
      <Route
        path="/explore"
        exact
        render={() => (
          <div>
            <Link to="/">ClickEXPLORE here to go back to root page.</Link>
          </div>
        )}
      />
      <Route
        path="/play"
        exact
        render={() => (
          <div>
            <Link to="/">CPLAYlick here to go back to root page.</Link>
          </div>
        )}
      />
    </>
  );
};
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={lightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />

          <QueryClientProvider client={queryClient}>
            <Routing />
            {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
          </QueryClientProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
