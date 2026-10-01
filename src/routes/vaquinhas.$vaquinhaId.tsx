import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { PixBox } from "@/components/PixBox";
import { vaquinhas } from "@/data/vaquinhas";

export const Route = createFileRoute("/vaquinhas/$vaquinhaId")({
  loader: ({ params }) => {
    const vaquinha = vaquinhas.find((v) => v.id === params.vaquinhaId);
    if (!vaquinha) throw notFound();
    return { vaquinha };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Campanha não encontrada | Carita's Pets" }, { name: "robots", content: "noindex" }],
      };
    }
    const { vaquinha } = loaderData;
    return {
      meta: [
        { title: `${vaquinha.pet} — Vaquinha | Carita's Pets` },
        { name: "description", content: vaquinha.resumo },
        { property: "og:title", content: `${vaquinha.pet} precisa de ajuda | Carita's Pets` },
        { property: "og:description", content: vaquinha.resumo },
        { property: "og:type", content: "article" },
        { property: "og:image", content: vaquinha.foto },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: vaquinha.foto },
      ],
    };
  },
  notFoundComponent: CampanhaNaoEncontrada,
  component: DetalheVaquinha,
});

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function CampanhaNaoEncontrada() {
  return (
    <SiteLayout>
      <div className="surface-vintage mx-auto max-w-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Campanha não encontrada</h1>
        <Link to="/vaquinhas" className="mt-4 inline-block text-primary underline underline-offset-4">
          Ver todas as vaquinhas
        </Link>
      </div>
    </SiteLayout>
  );
}

function DetalheVaquinha() {
  const { vaquinha: v } = Route.useLoaderData();
  const [laudoAberto, setLaudoAberto] = useState(false);
  const pct = Math.min(100, Math.round((v.arrecadado / v.meta) * 100));
  const total = v.orcamento.reduce((s, o) => s + o.valor, 0);

  return (
    <SiteLayout>
      <Link to="/vaquinhas" className="text-sm text-primary underline-offset-4 hover:underline">
        ← Voltar para as vaquinhas
      </Link>

      <section className="surface-vintage mt-4 grid gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:items-center">
        <img src={v.foto} alt={`Foto de ${v.pet}`} className="h-72 w-full rounded-md object-cover" />
        <div className="space-y-3">
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
            {v.categoria} · {v.status}
          </span>
          <h1 className="text-3xl font-bold text-foreground">{v.pet}</h1>
          <p className="text-sm text-muted-foreground">
            Responsável:{" "}
            <Link
              to="/doadores/$doadorId"
              params={{ doadorId: v.doadorId }}
              className="text-primary underline underline-offset-4"
            >
              {v.doador}
            </Link>
          </p>
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-4 w-full overflow-hidden rounded-full bg-accent"
          >
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-foreground">
            <strong>{brl(v.arrecadado)}</strong> arrecadados de {brl(v.meta)} ({pct}%)
          </p>
          <p className="text-sm text-muted-foreground">
            {v.status === "Meta Atingida" ? "Meta atingida" : `${v.diasRestantes} dias restantes`}
          </p>
          <a
            href="#pix"
            className="inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Ajudar Agora
          </a>
        </div>
      </section>

      <section className="surface-vintage mt-8 space-y-4 p-6">
        <h2 className="text-2xl font-bold text-foreground">História e diagnóstico</h2>
        <p className="text-sm text-foreground">{v.historia}</p>
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Diagnóstico veterinário:</strong> {v.diagnostico}
        </p>

        <div>
          <h3 className="text-lg font-semibold text-primary">Laudo veterinário anexado</h3>
          <button
            onClick={() => setLaudoAberto((a) => !a)}
            className="mt-2 flex items-center gap-3 rounded-md border border-input bg-card p-2 text-left text-sm hover:bg-accent"
            aria-expanded={laudoAberto}
          >
            <img src={v.laudo.imagem} alt="" className="h-16 w-16 rounded object-cover" />
            <span>
              <span className="block text-foreground">{v.laudo.titulo}</span>
              <span className="text-xs text-muted-foreground">
                {laudoAberto ? "Clique para recolher" : "Clique para ampliar"}
              </span>
            </span>
          </button>
          {laudoAberto && (
            <img
              src={v.laudo.imagem}
              alt={v.laudo.titulo}
              className="mt-3 w-full max-w-2xl rounded-md object-cover"
            />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-primary">Orçamento do tratamento</h3>
          <table className="mt-2 w-full max-w-2xl text-sm">
            <tbody>
              {v.orcamento.map((o) => (
                <tr key={o.item} className="border-b border-border">
                  <td className="py-2 text-foreground">{o.item}</td>
                  <td className="py-2 text-right text-muted-foreground">{brl(o.valor)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2 font-semibold text-foreground">Total</td>
                <td className="py-2 text-right font-semibold text-primary">{brl(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="pix" className="mt-8 scroll-mt-6">
        <h2 className="mb-3 text-2xl font-bold text-foreground">Doe via PIX</h2>
        <PixBox chave={v.pix.chave} tipo={v.pix.tipo} titular={v.pix.titular} />
      </section>

      <section className="surface-vintage mt-8 space-y-4 p-6">
        <h2 className="text-2xl font-bold text-foreground">Mural de prestação de contas</h2>
        <p className="text-sm text-muted-foreground">
          Notas fiscais de clínicas, recibos de remédios e fotos da evolução do pet, publicados pelo
          responsável pela campanha.
        </p>
        {v.prestacaoContas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ainda não há comprovantes publicados — a campanha começou recentemente.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {v.prestacaoContas.map((p) => (
              <li key={p.titulo} className="rounded-md border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">{p.data}</p>
                <h3 className="text-base font-semibold text-primary">{p.titulo}</h3>
                <p className="mt-1 text-sm text-foreground">{p.descricao}</p>
                {p.valor !== undefined && (
                  <p className="mt-1 text-sm text-muted-foreground">Valor: {brl(p.valor)}</p>
                )}
                {p.foto && (
                  <img
                    src={p.foto}
                    alt={p.titulo}
                    loading="lazy"
                    className="mt-3 h-40 w-full rounded object-cover"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteLayout>
  );
}
