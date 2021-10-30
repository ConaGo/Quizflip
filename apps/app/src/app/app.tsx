import { Route, Link } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { NavBar } from '../components/NavBar';
import { lightTheme, darkTheme } from '../styles/muiTheme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from '../hooks/useAuth';
import { QuestionForm } from '../components/QuestionForm';
import { Try } from '../components/Try';
const queryClient = new QueryClient();
const Routing = () => {
  return (
    <>
      <NavBar />
      <Try />
      <Route
        path="/"
        exact
        render={() => (
          <div>
            <Try />
          </div>
        )}
      />
      <Route
        path="/create"
        exact
        render={() => <QuestionForm categories={['ss']} />}
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
