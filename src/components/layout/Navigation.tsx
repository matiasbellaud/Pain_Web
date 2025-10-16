import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/about', label: 'À propos', icon: Info },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold">
            Pain Web
          </Link>
          <div className="flex gap-6">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === to
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
