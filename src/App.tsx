import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import NotFound from "./pages/NotFound";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="flex flex-col min-h-screen">
          <Header />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Index />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          {/* <Footer /> */}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const WrappedApp = () => (
  <BrowserRouter>
    <SmoothScroll>
      <ScrollToTop />
      <App />
    </SmoothScroll>
  </BrowserRouter>
);

export default WrappedApp;
