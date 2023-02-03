import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
} from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import themeDark from './theme/themes';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { KitChat } from './kitchat/kitchat';

function RequireAuth({ children }: any) {
    let navigate = useNavigate();

    const isLoggedIn = useSelector(
        (state: any) => state.userReducer.isLoggedIn
    );

    useEffect(() => {
        navigate(isLoggedIn ? '/dashboard' : '/login', { replace: true });
    }, []);

    // return children;
    return <></>;
}

function App() {
    const [isLoaded, setIsLoaded] = useState(false);

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                cacheTime: 60 * 1000 * 50,
            },
        },
    });

    const a = useSelector((state: any) => state.userReducer);
    const isLoggedIn = a.isLoggedIn;

    return (
        <>
            {
                <ThemeProvider theme={themeDark}>
                    <CssBaseline />
                    <QueryClientProvider client={queryClient}>
                        {isLoggedIn ? (
                            <Router>
                                <Routes>
                                    <Route
                                        path='/dashboard'
                                        element={<Dashboard />}
                                    />
                                    <Route path='*' element={<RequireAuth />} />
                                </Routes>
                            </Router>
                        ) : (
                            <Router>
                                <Routes>
                                    <Route path='/login' element={<Login />} />
                                    <Route path='*' element={<RequireAuth />} />
                                </Routes>
                            </Router>
                        )}
                        <Router>
                            <Routes>
                                <Route path='*' element={<RequireAuth />} />
                            </Routes>
                        </Router>
                    </QueryClientProvider>
                </ThemeProvider>
            }
        </>
    );
}

export default App;
