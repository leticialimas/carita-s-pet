import { useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

/**
 * Botão fixo de "Voltar" exibido em todas as páginas internas (nunca na Home).
 * Alvo de toque generoso no celular, seta clássica em marrom.
 */
export function BotaoVoltar() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/") return null;

  function voltar() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
      return;
    }
    router.navigate({ to: "/" });
  }

  return (
    <button
      type="button"
      onClick={voltar}
      aria-label="Voltar para a página anterior"
      className="fixed top-3 left-3 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-card/95 text-primary shadow-md backdrop-blur transition-colors hover:bg-accent md:top-4 md:left-4 md:h-11 md:w-auto md:gap-2 md:px-4"
    >
      <ArrowLeft size={22} strokeWidth={1.5} aria-hidden />
      <span className="hidden text-sm md:inline">Voltar</span>
    </button>
  );
}
