import { Link, useRouterState } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { lerAdotante, type Adotante } from "@/lib/adotante";
import { BottomNav } from "@/components/BottomNav";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { ControleFonte } from "@/components/ControleFonte";
import { MenuConfiguracoes } from "@/components/MenuConfiguracoes";

const nav = [
  { to: "/", label: "Página Inicial" },
  { to: "/pets", label: "Adotar" },
  { to: "/diario", label: "Finais Felizes" },
  { to: "/desaparecidos", label: "Animais Desaparecidos" },
  { to: "/vaquinhas", label: "Vaquinha dos Pets" },
  { to: "/doadores", label: "ONGs e Protetores" },
  { to: "/sobre", label: "Sobre Nós" },
] as const;


function NotificacaoChat({ nome }: { nome: string }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const abrir = setTimeout(() => setVisivel(true), 4000);
    return () => clearTimeout(abrir);
  }, []);

  if (!visivel) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="surface-vintage fixed right-4 bottom-20 z-50 w-[19rem] p-4 shadow-lg md:bottom-4"
    >
      <div className="flex items-start gap-3">
        <span aria-hidden className="text-xl">
          💬
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Nova mensagem no chat</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {nome}, a ONG Patinhas do Cerrado respondeu sobre a Mel.
          </p>
          <Link
            to="/chat"
            search={{ pet: "mel" }}
            onClick={() => setVisivel(false)}
            className="mt-2 inline-block text-sm text-primary underline underline-offset-4"
          >
            Abrir conversa
          </Link>
        </div>
        <button
          onClick={() => setVisivel(false)}
          aria-label="Fechar notificação"
          className="ml-auto text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [adotante, setAdotante] = useState<Adotante | null>(null);
  const naHome = useRouterState({ select: (s) => s.location.pathname === "/" });

  useEffect(() => {
    setAdotante(lerAdotante());
  }, []);

  const iniciais = (adotante?.nome ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex min-h-screen flex-col">
      <BotaoVoltar />
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div
          className={`mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 ${
            naHome ? "" : "pl-16 md:pl-32"
          }`}
        >
          <Link to="/" className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">Carita&apos;s Pets</span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Brasília - DF
            </span>
          </Link>

          <nav aria-label="Navegação principal" className="flex flex-wrap items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-secondary text-secondary-foreground" }}
                className="rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary/60 hover:text-secondary-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ControleFonte />
            {adotante ? (
              <>
                <Link
                  to="/favoritos"
                  aria-label="Meus favoritos"
                  className="hidden rounded-md border border-input bg-card px-3 py-1.5 text-primary hover:bg-secondary/60 md:flex"
                >
                  <Heart size={16} strokeWidth={1.5} />
                </Link>
                <Link
                  to="/chat"
                  search={{ pet: "mel" }}
                  aria-label="Abrir conversas"
                  className="relative rounded-md border border-input bg-card px-3 py-1.5 text-sm text-foreground hover:bg-secondary/60"
                >
                  💬
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    1
                  </span>
                </Link>
                <Link
                  to="/perfil"
                  title={adotante.nome}
                  aria-label="Meu perfil de adotante"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                >
                  {iniciais || "A"}
                </Link>
              </>

            ) : (
              <Link
                to="/cadastro"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Entrar / Cadastrar
              </Link>
            )}
            <MenuConfiguracoes />
          </div>
        </div>
        <div className="rule-accent h-1 w-full" />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 pb-24 md:pb-10">{children}</main>

      {adotante && <NotificacaoChat nome={adotante.nome.split(" ")[0] ?? "Olá"} />}
      <BottomNav />

      <footer className="mt-8 mb-16 border-t border-border bg-card/80 md:mb-0">
        <div className="rule-accent h-1 w-full" />
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-8 text-sm text-muted-foreground">
          <p className="text-base font-semibold text-primary">Carita&apos;s Pets</p>
          <p>
            <strong className="text-foreground">Desenvolvido por:</strong> Letícia da Silva Lima,
            Letícia Krixi de Souza, Maíra Gomes Rodrigues, Sophia Abarno Lemos e Vitória Santana
            Barbosa.
          </p>
          <p>
            <strong className="text-foreground">Brasília - DF</strong> | Somos uma plataforma 100%
            digital e independente, não possuímos sede física.
          </p>
          <p className="text-xs">
            Imagens de domínio público/licença livre (Unsplash, Wikimedia Commons, Pexels).
          </p>
        </div>
      </footer>
    </div>
  );
}
