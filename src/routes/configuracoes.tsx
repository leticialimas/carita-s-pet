import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { limparRascunho, listarRascunhos, tempoRelativo, type RascunhoSalvo } from "@/lib/rascunho";

type Secao = "anuncios" | "notificacoes" | "privacidade" | "ajuda";

const secoes: { id: Secao; titulo: string }[] = [
  { id: "anuncios", titulo: "Meus Pets / Anúncios" },
  { id: "notificacoes", titulo: "Notificações" },
  { id: "privacidade", titulo: "Privacidade" },
  { id: "ajuda", titulo: "Central de Ajuda" },
];

export const Route = createFileRoute("/configuracoes")({
  validateSearch: (search: Record<string, unknown>) => ({
    secao: (["anuncios", "notificacoes", "privacidade", "ajuda"].includes(String(search["secao"]))
      ? (search["secao"] as Secao)
      : "anuncios") as Secao,
  }),
  head: () => ({
    meta: [
      { title: "Configurações da conta | Carita's Pets" },
      {
        name: "description",
        content:
          "Gerencie seus anúncios de pets, avisos do chat e do diário, preferências de privacidade e a central de ajuda da Carita's Pets.",
      },
      { property: "og:title", content: "Configurações da conta | Carita's Pets" },
      {
        property: "og:description",
        content: "Anúncios, notificações, privacidade e ajuda em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const { secao } = Route.useSearch();
  const [rascunhos, setRascunhos] = useState<RascunhoSalvo<unknown>[]>([]);

  useEffect(() => {
    setRascunhos(listarRascunhos());
  }, []);

  return (
    <SiteLayout>
      <h1 className="text-3xl font-bold text-foreground">Configurações</h1>

      <nav className="mt-4 flex flex-wrap gap-2">
        {secoes.map((s) => (
          <Link
            key={s.id}
            to="/configuracoes"
            search={{ secao: s.id }}
            className={`rounded-full px-4 py-1.5 text-sm ${
              s.id === secao
                ? "bg-primary text-primary-foreground"
                : "border border-input bg-card text-foreground hover:bg-secondary/60 hover:text-secondary-foreground"
            }`}
          >
            {s.titulo}
          </Link>
        ))}
      </nav>

      <section className="surface-vintage mt-6 space-y-4 p-6 text-sm leading-relaxed text-foreground">
        {secao === "anuncios" && (
          <>
            <h2 className="text-xl font-semibold">Meus Pets / Anúncios</h2>
            <p className="text-muted-foreground">
              Aqui ficam os anúncios de adoção, as vaquinhas e os alertas de desaparecimento
              publicados pela sua conta.
            </p>
            {rascunhos.length === 0 ? (
              <p>Nenhum cadastro em andamento no momento.</p>
            ) : (
              rascunhos.map((r) => (
                <div key={r.chave} className="rounded-md border border-primary/30 bg-accent p-4">
                  <p className="text-accent-foreground">
                    Você tem um {r.rotulo.toLowerCase()} em andamento. Deseja continuar?
                  </p>
                  <p className="text-xs italic text-primary">
                    Última alteração salva {tempoRelativo(r.atualizadoEm)}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      to="/cadastro"
                      className="rounded-md bg-primary px-4 py-1.5 text-xs text-primary-foreground"
                    >
                      Continuar
                    </Link>
                    <button
                      onClick={() => {
                        limparRascunho(r.chave);
                        setRascunhos((l) => l.filter((x) => x.chave !== r.chave));
                      }}
                      className="rounded-md border border-input bg-card px-4 py-1.5 text-xs"
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              ))
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              <Link to="/desaparecidos" className="rounded-md border border-input bg-card px-4 py-2">
                Meus alertas de desaparecimento
              </Link>
              <Link to="/vaquinhas" className="rounded-md border border-input bg-card px-4 py-2">
                Minhas vaquinhas
              </Link>
            </div>
          </>
        )}

        {secao === "notificacoes" && (
          <>
            <h2 className="text-xl font-semibold">Notificações</h2>
            {[
              "Novas mensagens no chat",
              "Atualizações do Diário do Pet dos animais que doei",
              "Pets novos dentro dos meus filtros salvos",
              "Prestação de contas das vaquinhas que apoio",
            ].map((n) => (
              <label key={n} className="flex items-center gap-3 border-b border-border py-2 last:border-0">
                <input type="checkbox" defaultChecked className="h-4 w-4" />
                {n}
              </label>
            ))}
          </>
        )}

        {secao === "privacidade" && (
          <>
            <h2 className="text-xl font-semibold">Privacidade</h2>
            {[
              "Mostrar meu currículo de adoção apenas durante a conversa com a ONG",
              "Permitir que protetores vejam minha cidade",
              "Receber contato por WhatsApp",
            ].map((n) => (
              <label key={n} className="flex items-center gap-3 border-b border-border py-2 last:border-0">
                <input type="checkbox" defaultChecked className="h-4 w-4" />
                {n}
              </label>
            ))}
            <p className="text-muted-foreground">
              Seus documentos são usados apenas para verificação e nunca aparecem publicamente.
            </p>
          </>
        )}

        {secao === "ajuda" && (
          <>
            <h2 className="text-xl font-semibold">Central de Ajuda</h2>
            <dl className="space-y-3">
              {[
                ["Como funciona a adoção?", "Você se cadastra, conversa com a ONG pelo chat e combina a visita."],
                ["Preciso pagar algo?", "Não. A plataforma é gratuita; as vaquinhas são doações voluntárias."],
                ["Perdi meu pet, o que faço?", "Publique um alerta na aba Animais Desaparecidos e compartilhe o cartaz."],
              ].map(([p, r]) => (
                <div key={p} className="border-b border-border pb-3 last:border-0">
                  <dt className="font-semibold">{p}</dt>
                  <dd className="text-muted-foreground">{r}</dd>
                </div>
              ))}
            </dl>
            <Link to="/sobre" className="inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">
              Falar com a equipe
            </Link>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
