
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { router } from "./router";

// Create optimized query client for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      // Disable background refetching for better performance
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: 1,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CartProvider>
          <OrderProvider>
            <SettingsProvider>
              <TooltipProvider>
                <RouterProvider router={router} />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </SettingsProvider>
          </OrderProvider>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
