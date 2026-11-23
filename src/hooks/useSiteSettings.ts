import { useEffect, useState } from 'react';
import { getSiteSettings } from '../lib/api';

let cache: Promise<Record<string, string>> | null = null;

/**
 * Réglages du site (nom, coordonnées, navigation…) saisis dans le back-office.
 * Une seule requête pour toute l'application grâce au cache module.
 */
export function useSiteSettings(): Record<string, string> {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;

    if (!cache) cache = getSiteSettings();

    cache
      .then((values) => {
        if (active) setSettings(values);
      })
      .catch(() => {
        // les valeurs de repli du composant restent utilisées
      });

    return () => {
      active = false;
    };
  }, []);

  return settings;
}
