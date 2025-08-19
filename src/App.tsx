import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CRMProvider } from "@/contexts/CRMContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import Pipeline from "./pages/Pipeline";
import Contacts from "./pages/Contacts";
import Integrations from "./pages/Integrations";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen w-full bg-background">
    <Sidebar />
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CRMProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AppLayout>
                <Index />
              </AppLayout>
            } />
            <Route path="/pipeline" element={
              <AppLayout>
                <Pipeline />
              </AppLayout>
            } />
            <Route path="/contacts" element={
              <AppLayout>
                <Contacts />
              </AppLayout>
            } />
            <Route path="/integrations" element={
              <AppLayout>
                <Integrations />
              </AppLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CRMProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
