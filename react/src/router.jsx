import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './views/Dashboard.jsx';
import Login from './views/Login.jsx';
import Signup from './views/Signup.jsx';
import AdminLogin from './views/AdminLogin.jsx';
import AdminSignup from './views/AdminSignup.jsx';
import AdminDashboard from './views/AdminDashboard.jsx';
import NotFound from './views/NotFound.jsx'
import Customers from './components/Customers.jsx';
import AdminInfo from './components/AdminInfo.jsx';
import CustomersAccounts from './components/CustomersAccounts.jsx';
import AdminDepostiMoney from './components/AdminDepostiMoney.jsx';
import AdminTransactionHistory from './components/AdminTransactionHistory.jsx';
import CustomerInfo from './components/CustomerInfo.jsx';
import CustomerTransfer from './components/CustomerTransfer.jsx';
import CustomerTransferHistory from './components/CustomerTransferHistory.jsx';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/adminLogin',
        element: <AdminLogin />
    },
    {
        path: '/adminSignup',
        element: <AdminSignup />
    },
    {
        path: '/',
        element: <Dashboard />,
        children: [
            {
                path: '',
                element: <CustomerInfo />
            },
            {
                path: '/transfer',
                element: <CustomerTransfer />
            },
            {
                path: '/history',
                element: <CustomerTransferHistory />
            }
        ]
    },
    {
        path: '/adminDashboard',
        element: <AdminDashboard />,
        children: [
            {
                path: '',
                element: <AdminInfo/>
            },
           {
                path: 'customers',
                element: <Customers/>
           },
           {
                path: 'customersAccounts',
                element: <CustomersAccounts/>
           },
           {
                path: 'adminDeposit',
                element: <AdminDepostiMoney/>
           },
           {
                path: 'adminHistory',
                element: <AdminTransactionHistory />
           }

        ]
    },
    {
        path: '/404',
        element: <NotFound />
    }
]);

export default router;