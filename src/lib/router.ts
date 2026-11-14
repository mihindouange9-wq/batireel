import { useSyncExternalStore } from "react";

/* Routage minimal par l'API History : six pages, aucune dépendance. L'hébergement réécrit toute adresse
   inconnue vers index.html (render.yaml), une adresse profonde s'ouvre donc directement sur sa page. */

export const ROUTES = ["/", "/concept", "/passeport", "/comparateur", "/professionnels", "/projet"] as const;
export type Route = (typeof ROUTES)[number];

/** Ramène un chemin quelconque à une route connue (barre finale et casse ignorées ; inconnu : l'accueil). */
export function toRoute(pathname: string): Route {
  const p = (pathname.replace(/\/+$/, "") || "/").toLowerCase();
  return (ROUTES as readonly string[]).includes(p) ? (p as Route) : "/";
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") window.addEventListener("popstate", emit);

/** Change de page (ajoute une entrée d'historique). Le paramètre de recherche et l'ancre sont conservés tels quels. */
export function navigate(to: string) {
  const url = new URL(to, window.location.origin);
  if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash === window.location.hash) return;
  window.history.pushState(null, "", url.pathname + url.search + url.hash);
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** La route courante, tenue à jour par les boutons précédent/suivant du navigateur et par `navigate`. */
export function useRoute(): Route {
  return useSyncExternalStore(
    subscribe,
    () => toRoute(window.location.pathname),
    () => "/" as Route,
  );
}
