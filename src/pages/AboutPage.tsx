import React from 'react';

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">À propos</h1>
      <p className="text-muted-foreground mb-4">
        Cette application a été créée avec les technologies modernes suivantes :
      </p>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>React 19 avec TypeScript</li>
        <li>React Router pour la navigation</li>
        <li>Tailwind CSS pour le styling</li>
        <li>shadcn/ui pour les composants UI</li>
        <li>Lucide React pour les icônes</li>
      </ul>
    </div>
  );
}
