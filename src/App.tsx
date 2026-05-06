import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const AUTH_URL = "https://functions.poehali.dev/d8116b33-01fd-4dbd-8c71-ce91075767e5";

const queryClient = new QueryClient();

interface User {
  name: string;
  phone: string;
  username?: string;
}

function AppInner() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pulse_token");
    if (!token) { setChecking(false); return; }

    fetch(`${AUTH_URL}?action=get_me`, {
      headers: { "X-Auth-Token": token },
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok && data.user?.name) {
          setUser(data.user);
        } else {
          localStorage.removeItem("pulse_token");
          localStorage.removeItem("pulse_user");
        }
      })
      .catch(() => {
        const cached = localStorage.getItem("pulse_user");
        if (cached) setUser(JSON.parse(cached));
      })
      .finally(() => setChecking(false));
  }, []);

  const handleAuth = (token: string, u: User) => {
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem("pulse_token");
    localStorage.removeItem("pulse_user");
    setUser(null);
  };

  if (checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a12]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center animate-float">
            <span className="text-white font-display font-black text-2xl">P</span>
          </div>
          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppInner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
