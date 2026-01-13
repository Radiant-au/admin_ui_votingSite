import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Control from "./pages/Control";
import Moderators from "./pages/Moderators";
import Scoring from "./pages/Scoring";
import FinalWinnersReveal from "./pages/FinalWinnersReveal";
import PinCodeLogs from "./pages/PinCodeLogs";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/candidates" element={<ProtectedRoute adminOnly><Candidates /></ProtectedRoute>} />
          <Route path="/scoring" element={<ProtectedRoute adminOnly><Scoring /></ProtectedRoute>} />
          <Route path="/moderators" element={<ProtectedRoute adminOnly><Moderators /></ProtectedRoute>} />
          <Route path="/control" element={<ProtectedRoute adminOnly><Control /></ProtectedRoute>} />
          <Route path="/reveal" element={<ProtectedRoute adminOnly><FinalWinnersReveal /></ProtectedRoute>} />
          <Route path="/pincode-logs" element={<ProtectedRoute adminOnly><PinCodeLogs /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
