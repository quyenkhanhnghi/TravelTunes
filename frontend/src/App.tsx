import { Navbar } from './components/Navbar';
import './css/style.css';

import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { Overview } from './components/OverviewPage/Overview';
import { TourDetail } from './components/TourPage/TourDetail';
import { fetchFromApi } from './services/fetch';
import { Login } from './components/LoginPage/Login';
import { AuthProvider } from './context/Provider/AuthProvider';
import { RequiredAuth } from './components/RequiredAuth';
import { PersistLogin } from './components/PersistLogin';
import { ErrorPage } from './components/ErrorPage';
import { AccountDetail } from './components/AccountPage/AccountDetail';

// export type ContextType = {
//   state: StateType;
//   dispatch: React.Dispatch<ReducerAction>;
// };

// export const UserContext = React.createContext<ContextType | null>(null);

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

interface AppProps {}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} errorElement={<ErrorPage />}>
      <Route element={<PersistLogin />}>
        <Route
          index
          element={<Overview />}
          loader={fetchFromApi}
          errorElement={<ErrorPage />}
        />
        <Route path='/login' element={<Login />} />
        <Route
          element={
            <RequiredAuth allowedRoles={['admin', 'user', 'lead-guide']} />
          }
          errorElement={<ErrorPage />}
        >
          <Route path='tours/:tourSlug' element={<TourDetail />} />
          <Route path='/account' element={<AccountDetail />} />
        </Route>
        <Route path='/error' element={<ErrorPage />} />
      </Route>
    </Route>
  )
);

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         element: <PersistLogin />,
//         children: [
//           // Public routes
//           {
//             index: true,
//             loader: fetchFromApi,
//             element: <Overview />,
//           },
//           {
//             path: 'login',
//             element: <Login />,
//           },
//           // Protected routes
//           {
//             element: (
//               <RequiredAuth allowedRoles={['admin', 'user', 'lead-guide']} />
//             ),
//             children: [
//               {
//                 path: 'tours/:tourSlug',
//                 element: <TourDetail />,
//               },
//             ],
//           },
//         ],
//       },
//       // Protected routes
//       // {
//       //   path: 'tours/:tourSlug',
//       //   loader: async ({ params }) => fetchTourDetail(params.tourSlug!),
//       //   element: <TourDetail />,
//       // },
//     ],
//   },
// ]);

export const App: React.FC<AppProps> = ({}) => {
  return (
    // <UserContext.Provider value={{ state, dispatch }}>
    //   <RouterProvider router={router} />;
    // </UserContext.Provider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
