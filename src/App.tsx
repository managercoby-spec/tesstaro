// src/App.tsx
import React from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

import { AuthProvider } from "@/contexts/AuthContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./components/AdminPanel"; // Layout يحتوي على <Outlet />
import UsersPage from "./pages/admin/UsersPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Admin layout with nested routes */}
                <Route path="/admin" element={<AdminPanel />}>
                  {/* مثال لصفحة افتراضية داخل لوحة الإدارة */}
                  <Route index element={<div />} />
                  <Route path="users" element={<UsersPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
