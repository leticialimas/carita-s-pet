import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { vaquinhas, type CategoriaVaquinha, type StatusVaquinha } from "@/data/vaquinhas";

export const Route = createFileRoute("/vaquinhas/")({
  head: () => ({
    meta: [
      { title: "Vaquinha dos Pets | Carita's Pets" },
      {
        name: "description",
        content:
          "Campanhas de arrecadação para cirurgias, ração, castração e abrigo de cães e gatos resgatados em Brasília - DF.",
      },
      { property: "og:title", content: "Vaquinha dos Pets | Carita's Pets" },
      {
        property: "og:description",
        content: "Ajude tratamentos, castrações e alimentação de pets resgatados no Distrito Federal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Vaquinhas,
});

const categorias: (CategoriaVaquinha | "Todas")[] = [
  "Todas",
  "Saúde/Cirurgia",
  "Ração/Alimentação",
  "Castração",
  "Abrigo/Infraestrutura",
];
const status: (StatusVaquinha | "Todos")[] = ["Todos", "Em andamento", "Meta Atingida"];

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Vaquinhas() {
  const [cat, setCat] = useState<(typeof categorias)[number]>("Todas");
  const [st, setSt] = useState<(typeof status)[number]>("Todos");

  const lista = vaquinhas.filter(
    (v) => (cat === "Todas" || v.categoria === cat) && (st === "Todos" || v.status === st),
  );

  return (
    <SiteLayout>
      <h1 className="text-3xl font-bold text-foreground">Vaquinha dos Pets</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Campanhas de urgência criadas por ONGs e protetores independentes cadastrados na plataforma.
        Toda arrecadação vai direto para a chave PIX do responsável, com prestação de contas pública.
      </p>

      <div className="surface-vintage mt-6 grid gap-4 p-5 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-foreground">Categoria</span>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as (typeof categorias)[number])}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            {categorias.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-foreground">Status</span>
          <select
            value={st}
            onChange={(e) => setSt(e.target.value as (typeof status)[number])}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            {status.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((v) => {
          const pct = Math.min(100, Math.round((v.arrecadado / v.meta) * 100));
          return (
            <article key={v.id} className="surface-vintage flex flex-col overflow-hidden">
              <img
                src={v.foto}
                alt={`Campanha para ${v.pet}`}
                loading="lazy"
                className="h-48 w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
                  {v.categoria}
                </span>
                <h2 className="text-xl font-semibold text-foreground">{v.pet}</h2>
                <Link
                  to="/doadores/$doadorId"
                  params={{ doadorId: v.doadorId }}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  {v.doador}
                </Link>
                <p className="text-sm text-muted-foreground">{v.resumo}</p>

                <div className="mt-2">
                  <div
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progresso da campanha de ${v.pet}`}
                    className="h-3 w-full overflow-hidden rounded-full bg-accent"
                  >
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-sm text-foreground">
                    <strong>{pct}%</strong> · {brl(v.arrecadado)} de {brl(v.meta)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {v.status === "Meta Atingida"
                      ? "Meta atingida — obrigado!"
                      : `${v.diasRestantes} dias restantes`}
                  </p>
                </div>

                <Link
                  to="/vaquinhas/$vaquinhaId"
                  params={{ vaquinhaId: v.id }}
                  className="mt-auto rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
                >
                  Ajudar Agora
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {lista.length === 0 && (
        <p className="surface-vintage mt-8 p-6 text-center text-sm text-muted-foreground">
          Nenhuma campanha encontrada com esses filtros.
        </p>
      )}
    </SiteLayout>
  );
}
