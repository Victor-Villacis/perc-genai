import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


import Home from "./pages/Home";
import Index from "./pages/Index";

const queryClient = new QueryClient();


// My routes are defined here using react-router-dom
const routes = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <Index />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

// This is the main component of the app which wraps the router and query client
// I am also using React Query Devtools to help me debug my queries
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}