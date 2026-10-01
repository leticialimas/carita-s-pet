import { Link } from "@tanstack/react-router";
import { Heart, Home, MessageCircle, Search } from "lucide-react";
import { useFavoritos } from "@/lib/favoritos";

export function BottomNav() {
  const favoritos = useFavoritos();

  const itens = [
    { to: "/", label: "Início", Icone: Home, exact: true, badge: 0 },
    { to: "/pets", label: "Buscar Pets", Icone: Search, exact: false, badge: 0 },
    { to: "/favoritos", label: "Favoritos", Icone: Heart, exact: false, badge: favoritos.length },
    { to: "/chat", label: "Chat", Icone: MessageCircle, exact: false, badge: 0 },
  ] as const;

  return (
    <nav
      aria-label="Navegação rápida"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="rule-accent h-0.5 w-full" />
      <ul className="grid grid-cols-4">
        {itens.map(({ to, label, Icone, exact, badge }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              activeProps={{ className: "text-primary", "aria-current": "page" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="relative flex flex-col items-center gap-1 py-2 text-[11px]"
            >
              <Icone size={22} strokeWidth={1.25} aria-hidden />
              <span>{label}</span>
              {badge > 0 && (
                <span className="absolute top-1 right-1/4 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                  {badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
