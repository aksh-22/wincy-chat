import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import themeDark from './theme/themes';

function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                cacheTime: 60 * 1000 * 50,
            },
        },
    });

    return (
        <>
            {
                <ThemeProvider theme={themeDark}>
                    <CssBaseline />
                    <QueryClientProvider client={queryClient}>
                        <ReactQueryDevtools initialIsOpen={false} />
                        <Router>
                            <Routes>
                                <Route path='/' element={<Login />} />
                                <Route
                                    path='/dashboard'
                                    element={<Dashboard />}
                                />
                            </Routes>
                        </Router>
                    </QueryClientProvider>
                </ThemeProvider>
            }
        </>
    );
}

export default App;
