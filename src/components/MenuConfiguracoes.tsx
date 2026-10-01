import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { listarRascunhos, limparRascunho, tempoRelativo } from "@/lib/rascunho";

type Item = {
  label: string;
  to: string;
  search?: Record<string, string>;
};

const itens: Item[] = [
  { label: "Editar Meu Perfil", to: "/perfil" },
  { label: "Gerenciar Meus Pets/Anúncios", to: "/configuracoes", search: { secao: "anuncios" } },
  { label: "Notificações", to: "/configuracoes", search: { secao: "notificacoes" } },
  { label: "Privacidade", to: "/configuracoes", search: { secao: "privacidade" } },
  { label: "Central de Ajuda", to: "/configuracoes", search: { secao: "ajuda" } },
];

export function MenuConfiguracoes() {
  const [aberto, setAberto] = useState(false);
  const [rascunhos, setRascunhos] = useState<{ chave: string; rotulo: string; atualizadoEm: number }[]>(
    [],
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!aberto) return;
    setRascunhos(listarRascunhos().map((r) => ({ chave: r.chave, rotulo: r.rotulo, atualizadoEm: r.atualizadoEm })));
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [aberto]);

  function sair() {
    try {
      localStorage.removeItem("caritas-pets-adotante");
    } catch {
      /* ignora */
    }
    setAberto(false);
    navigate({ to: "/" });
    window.location.reload();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir menu de configurações"
        aria-expanded={aberto}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-card text-primary transition-colors hover:bg-secondary/60"
      >
        <Menu size={22} strokeWidth={2} aria-hidden />
      </button>

      {aberto && (
        <div className="fixed inset-0 z-[60]">
          <button
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
            className="absolute inset-0 bg-foreground/30"
          />
          <aside
            role="dialog"
            aria-label="Menu de configurações"
            className="absolute top-0 right-0 flex h-full w-[19rem] max-w-[85vw] flex-col border-l border-primary/30 bg-secondary shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-lg font-bold text-primary">Configurações</p>
              <button
                onClick={() => setAberto(false)}
                aria-label="Fechar menu"
                className="text-primary hover:opacity-70"
              >
                <X size={20} strokeWidth={1.75} aria-hidden />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <ul className="border-t border-primary/20">
                {itens.map((item) => (
                  <li key={item.label} className="border-b border-primary/20">
                    <Link
                      to={item.to}
                      {...(item.search ? { search: item.search } : {})}
                      onClick={() => setAberto(false)}
                      className="block px-5 py-3.5 text-base text-secondary-foreground transition-colors hover:bg-white/40"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="border-b border-primary/20">
                  <button
                    onClick={sair}
                    className="w-full px-5 py-3.5 text-left text-base text-primary/80 transition-colors hover:bg-white/40"
                  >
                    Sair
                  </button>
                </li>
              </ul>

              {rascunhos.length > 0 && (
                <div className="m-4 rounded-md border border-primary/30 bg-card/80 p-4">
                  <p className="text-sm font-semibold text-primary">Cadastros em andamento</p>
                  {rascunhos.map((r) => (
                    <div key={r.chave} className="mt-3 text-sm">
                      <p className="text-foreground">
                        Você tem um {r.rotulo.toLowerCase()} em andamento. Deseja continuar?
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        Salvo {tempoRelativo(r.atualizadoEm)}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Link
                          to="/cadastro"
                          onClick={() => setAberto(false)}
                          className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                        >
                          Continuar
                        </Link>
                        <button
                          onClick={() => {
                            limparRascunho(r.chave);
                            setRascunhos((lista) => lista.filter((x) => x.chave !== r.chave));
                          }}
                          className="rounded-md border border-input bg-card px-3 py-1.5 text-xs text-foreground"
                        >
                          Descartar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
