import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Selos } from "@/components/Selos";
import { doadores } from "@/data/doadores";

export const Route = createFileRoute("/doadores/")({
  head: () => ({
    meta: [
      { title: "ONGs e Protetores | Carita's Pets" },
      {
        name: "description",
        content:
          "Conheça as ONGs e protetores independentes cadastrados e verificados em Brasília - DF que resgatam cães e gatos.",
      },
      { property: "og:title", content: "ONGs e Protetores | Carita's Pets" },
      {
        property: "og:description",
        content: "Perfis verificados de ONGs e protetores independentes do Distrito Federal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Doadores,
});

const filtros = ["Todos", "ONG", "Protetor Independente"] as const;

function Doadores() {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>("Todos");
  const lista = doadores.filter((d) => filtro === "Todos" || d.tipo === filtro);

  return (
    <SiteLayout>
      <h1 className="text-3xl font-bold text-foreground">ONGs e Protetores</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Todos os perfis abaixo passaram por conferência de documentos e possuem o selo de
        Cadastrado &amp; Verificado em Brasília - DF.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-md border border-input px-4 py-2 text-sm transition-colors ${
              filtro === f
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {f === "Todos" ? "Todos" : f === "ONG" ? "ONGs" : "Protetores Independentes"}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((d) => (
          <article key={d.id} className="surface-vintage flex flex-col gap-3 p-5">
            <div className="flex items-center gap-3">
              <img
                src={d.avatar}
                alt={`Logo de ${d.nome}`}
                loading="lazy"
                className="h-14 w-14 rounded-full object-cover"
              />
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-foreground">{d.nome}</h2>
                <p className="text-xs text-muted-foreground">
                  {d.tipo} · {d.cidade}
                </p>
              </div>
            </div>
            <Selos doador={d} compacto />
            <p className="text-sm text-muted-foreground">{d.missao}</p>
            <p className="text-xs text-primary">
              {d.estatisticas.resgatados} resgatados · {d.estatisticas.adocoes} adoções ·{" "}
              {d.estatisticas.campanhas} campanha(s)
            </p>
            <Link
              to="/doadores/$doadorId"
              params={{ doadorId: d.id }}
              className="mt-auto rounded-md bg-secondary px-4 py-2 text-center text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              Ver perfil completo
            </Link>
          </article>
        ))}
      </div>
    </SiteLayout>
  );
}
