import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="container mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
