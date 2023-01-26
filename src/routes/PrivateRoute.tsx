import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }: any) => {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn) {
        // user is not authenticated
        return <Navigate to='/' />;
    }
    return <>{children}</>;
};

export default PrivateRoute;
