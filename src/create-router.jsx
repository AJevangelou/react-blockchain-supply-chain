import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

export default function createRouter() {
    const BooksPageLazy = React.lazy(() => import('./components/BookForm'));
    const ShipmentsPageLazy = React.lazy(() => import('./components/ShipmentForm'));
    const TransfersPageLazy = React.lazy(() => import('./components/ShipmentTransfers'));
    const LandingPageLazy = React.lazy(() => import('./components/LandingPage'));
    const router = createBrowserRouter([
        {
            path: "/",
            element: <LandingPageLazy />,
            // errorElement: <ErrorPage />,
            // loader: () => React.,
            // action: rootAction,
            children: [
                {
                    path: "",
                    element: <LandingPageLazy/>
                },
                {
                    path: "books",
                    element: <BooksPageLazy/>
                },
                {
                    path: "shipments",
                    element: <ShipmentsPageLazy />
                },
                {
                    path: "transfers",
                    element: <TransfersPageLazy />
                },
            ]
        }
    ]);
    return router;
}