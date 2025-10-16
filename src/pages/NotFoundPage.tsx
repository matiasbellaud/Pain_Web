import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl text-muted-foreground mb-8">Page non trouvée</p>
      <Link
        to="/"
        className="text-primary hover:underline"
      >
        Retourner à l'accueil
      </Link>
    </div>
  );
}
