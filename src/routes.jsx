import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';

import MainLayout from './layouts/main-layout';
import ProductPage from './pages/product';
import LocationPage from './pages/location';
import ReviewPage from './pages/review';
import ThankYouPage from './pages/thank-you';
import TrackPage from './pages/track';

export const router = createBrowserRouter([
  {
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
    ),
    children: [
      { path: '/', element: <ProductPage /> },
      { path: '/location', element: <LocationPage /> },
      { path: '/review', element: <ReviewPage /> },
      { path: '/thank-you', element: <ThankYouPage /> },
      { path: '/track', element: <TrackPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
