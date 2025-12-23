import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/components/LanguageSwitcher";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Home } from "./pages/Home";
import { Organisateurs } from "./pages/Organisateurs";
import { Register } from "./pages/Register";
import { Contestants } from "./pages/Contestants";
import { Vote } from "./pages/Vote";
import { VoteEnhanced } from "./pages/VoteEnhanced";
import { JuryAuth } from "./pages/JuryAuth";
import { JuryDashboard } from "./pages/JuryDashboard";
import { News } from "./pages/News";
import { Auth } from "./pages/Auth";
import { PerformanceVideos } from "./pages/PerformanceVideos";
import { Admin } from "./pages/Admin";
import { Dashboard } from "./pages/Dashboard";
import { FAQ } from "./pages/FAQ";
import { Contact } from "./pages/Contact";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { Winners } from "./pages/Winners";
import { Jury } from "./pages/Jury";
import { Calendar } from "./pages/Calendar";
import { Results } from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/organisateurs" element={<Organisateurs />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contestants" element={<Contestants />} />
                  <Route path="/vote" element={<VoteEnhanced />} />
                  <Route path="/vote-simple" element={<Vote />} />
                  <Route path="/jury-auth" element={<JuryAuth />} />
                  <Route path="/jury-dashboard" element={<JuryDashboard />} />
                <Route path="/news" element={<News />} />
                <Route path="/performance-videos" element={<PerformanceVideos />} />
                <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/winners" element={<Winners />} />
                  <Route path="/jury" element={<Jury />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/results" element={<Results />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </main>
              <Footer />
              <BackToTop />
              <WhatsAppButton />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
