import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles.css';

import { Layout } from './routes/Layout.jsx';
import { Home } from './routes/Home.jsx';
import { Upload } from './routes/Upload.jsx';
import { Review } from './routes/Review.jsx';
import { Help } from './routes/Help.jsx';
import { About } from './routes/About.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'upload', element: <Upload /> },
      { path: 'review', element: <Review /> },
      { path: 'help', element: <Help /> },
      { path: 'about', element: <About /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


