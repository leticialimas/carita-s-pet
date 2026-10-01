import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { PixBox } from "@/components/PixBox";
import { Selos } from "@/components/Selos";
import { doadores } from "@/data/doadores";
import { pets } from "@/data/pets";
import { vaquinhas } from "@/data/vaquinhas";

export const Route = createFileRoute("/doadores/$doadorId")({
  loader: ({ params }) => {
    const doador = doadores.find((d) => d.id === params.doadorId);
    if (!doador) throw notFound();
    return { doador };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Perfil não encontrado | Carita's Pets" }, { name: "robots", content: "noindex" }],
      };
    }
    const { doador } = loaderData;
    return {
      meta: [
        { title: `${doador.nome} | Carita's Pets` },
        { name: "description", content: doador.missao },
        { property: "og:title", content: `${doador.nome} | Carita's Pets` },
        { property: "og:description", content: doador.missao },
        { property: "og:type", content: "profile" },
        { property: "og:image", content: doador.avatar },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: doador.avatar },
      ],
    };
  },
  notFoundComponent: PerfilNaoEncontrado,
  component: PerfilDoador,
});

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const abas = ["Feed de Histórias", "Apadrinhar & Doar", "Pets para Adoção"] as const;

function PerfilNaoEncontrado() {
  return (
    <SiteLayout>
      <div className="surface-vintage mx-auto max-w-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Perfil não encontrado</h1>
        <Link to="/doadores" className="mt-4 inline-block text-primary underline underline-offset-4">
          Ver ONGs e protetores
        </Link>
      </div>
    </SiteLayout>
  );
}

function PerfilDoador() {
  const { doador: d } = Route.useLoaderData();
  const [aba, setAba] = useState<(typeof abas)[number]>("Feed de Histórias");
  const [padrinho, setPadrinho] = useState<number | null>(null);
  const [confirmado, setConfirmado] = useState(false);

  const petsDoDoador = pets.filter((p) => p.doador === d.nome);
  const campanhas = vaquinhas.filter((v) => v.doadorId === d.id);

  return (
    <SiteLayout>
      <section className="surface-vintage grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
        <img
          src={d.avatar}
          alt={`Logo de ${d.nome}`}
          className="h-28 w-28 rounded-full object-cover"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{d.nome}</h1>
          <p className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            ✓ Cadastrado &amp; Verificado em Brasília - DF
          </p>
          <Selos doador={d} />
          <p className="text-sm text-muted-foreground">
            {d.tipo} · {d.cidade}
          </p>
          <p className="text-sm text-foreground">{d.missao}</p>
          <p className="flex flex-wrap gap-3 text-sm">
            {d.redes.map((r) => (
              <a
                key={r.rede}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4"
              >
                {r.rede}
              </a>
            ))}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { rotulo: "Pets Resgatados", valor: d.estatisticas.resgatados },
          { rotulo: "Adoções Concluídas", valor: d.estatisticas.adocoes },
          { rotulo: "Campanhas Ativas", valor: d.estatisticas.campanhas },
        ].map((s) => (
          <div key={s.rotulo} className="surface-vintage p-5 text-center">
            <p className="text-3xl font-bold text-primary">{s.valor}</p>
            <p className="text-sm text-muted-foreground">{s.rotulo}</p>
          </div>
        ))}
      </section>

      <div role="tablist" aria-label="Seções do perfil" className="mt-8 flex flex-wrap gap-2">
        {abas.map((a) => (
          <button
            key={a}
            role="tab"
            aria-selected={aba === a}
            onClick={() => setAba(a)}
            className={`rounded-md border border-input px-4 py-2 text-sm transition-colors ${
              aba === a
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {aba === "Feed de Histórias" && (
        <section className="mt-6 space-y-5">
          {d.feed.map((p) => (
            <article key={p.id} className="surface-vintage overflow-hidden p-5">
              <div className="flex items-center gap-3">
                <img src={d.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{d.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.data} · {p.tag}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground">{p.texto}</p>
              {p.foto && (
                <img
                  src={p.foto}
                  alt={p.texto.slice(0, 60)}
                  loading="lazy"
                  className="mt-3 h-72 w-full rounded-md object-cover"
                />
              )}
            </article>
          ))}
        </section>
      )}

      {aba === "Apadrinhar & Doar" && (
        <section className="mt-6 space-y-6">
          <PixBox chave={d.pix.chave} tipo={d.pix.tipo} titular={d.pix.titular} banco={d.banco} />

          <div className="surface-vintage space-y-4 p-6">
            <h2 className="text-xl font-semibold text-primary">Apadrinhamento Mensal</h2>
            <p className="text-sm text-muted-foreground">
              Escolha um valor fixo mensal para ajudar na alimentação e nos cuidados veterinários
              dos animais sob responsabilidade de {d.nome}.
            </p>
            <div className="flex flex-wrap gap-2">
              {d.apadrinhamento.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setPadrinho(v);
                    setConfirmado(false);
                  }}
                  className={`rounded-md border border-input px-5 py-2 text-sm ${
                    padrinho === v ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  {brl(v)}/mês
                </button>
              ))}
            </div>
            <button
              onClick={() => padrinho && setConfirmado(true)}
              disabled={!padrinho}
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
            >
              Quero ser padrinho/madrinha
            </button>
            {confirmado && padrinho && (
              <p className="rounded-md bg-accent/60 px-4 py-3 text-sm text-accent-foreground">
                Apadrinhamento de {brl(padrinho)}/mês registrado! Use a chave PIX acima para a
                primeira contribuição — {d.nome} entrará em contato pelo chat.
              </p>
            )}
          </div>

          {campanhas.length > 0 && (
            <div className="surface-vintage p-6">
              <h2 className="text-xl font-semibold text-primary">Campanhas deste perfil</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {campanhas.map((c) => (
                  <li key={c.id}>
                    <Link
                      to="/vaquinhas/$vaquinhaId"
                      params={{ vaquinhaId: c.id }}
                      className="text-primary underline underline-offset-4"
                    >
                      {c.pet} — {c.categoria} ({brl(c.arrecadado)} de {brl(c.meta)})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {aba === "Pets para Adoção" && (
        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {petsDoDoador.length === 0 && (
            <p className="surface-vintage p-6 text-sm text-muted-foreground">
              Nenhum pet sob custódia direta disponível no momento.
            </p>
          )}
          {petsDoDoador.map((p) => (
            <article key={p.id} className="surface-vintage flex flex-col overflow-hidden">
              <img
                src={p.foto}
                alt={`${p.nome}, ${p.especie === "cao" ? "cão" : "gato"} para adoção`}
                loading="lazy"
                className="h-48 w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="text-lg font-semibold text-foreground">{p.nome}</h3>
                <p className="text-sm text-muted-foreground">
                  {p.idade} · porte {p.porte} · {p.cidade}
                </p>
                <p className="text-sm text-foreground">{p.descricao}</p>
                <Link
                  to="/pets"
                  className="mt-auto rounded-md bg-secondary px-4 py-2 text-center text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  Ver ficha de adoção
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </SiteLayout>
  );
}
