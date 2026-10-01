import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre Nós | Carita's Pets" },
      {
        name: "description",
        content:
          "Carita's Pets é uma plataforma 100% digital e independente de Brasília - DF que conecta ONGs, protetores independentes e adotantes de cães e gatos.",
      },
      { property: "og:title", content: "Sobre Nós | Carita's Pets" },
      {
        property: "og:description",
        content: "Conheça a missão e o time por trás da Carita's Pets, em Brasília - DF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteLayout>
      <h1 className="text-3xl font-bold text-foreground">Sobre Nós</h1>

      <section className="surface-vintage mt-6 space-y-4 p-6">
        <p className="text-sm text-foreground">
          A Carita&apos;s Pets nasceu em Brasília - DF com um propósito simples: dar visibilidade
          aos cães e gatos resgatados no Distrito Federal e aproximar quem cuida de quem quer
          adotar. Somos uma plataforma 100% digital e independente e não possuímos sede física — não
          recebemos animais nem realizamos visitas.
        </p>
        <p className="text-sm text-foreground">
          Nosso papel é organizar informação confiável: cadastros verificados de ONGs e protetores
          independentes, catálogo de pets, campanhas de arrecadação com prestação de contas pública
          e um canal de conversa direto entre doador e adotante.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          {
            titulo: "Adoção responsável",
            texto:
              "Adotantes passam por questionário de moradia, envio de comprovante de residência e aceite do Termo de Posse Responsável.",
          },
          {
            titulo: "Transparência financeira",
            texto:
              "Cada vaquinha exibe orçamento, laudo veterinário e mural com notas fiscais e recibos publicados pelo responsável.",
          },
          {
            titulo: "Verificação de doadores",
            texto:
              "ONGs enviam estatuto ou cartão CNPJ; protetores comprovam atuação com histórico de resgates e atendimentos veterinários.",
          },
        ].map((c) => (
          <article key={c.titulo} className="surface-vintage p-6">
            <h2 className="text-lg font-semibold text-primary">{c.titulo}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.texto}</p>
          </article>
        ))}
      </section>

      <section className="surface-vintage mt-8 space-y-3 p-6">
        <h2 className="text-2xl font-bold text-foreground">Quem faz a Carita&apos;s Pets</h2>
        <ul className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
          {[
            "Letícia da Silva Lima",
            "Letícia Krixi de Souza",
            "Maíra Gomes Rodrigues",
            "Sophia Abarno Lemos",
            "Vitória Santana Barbosa",
          ].map((n) => (
            <li key={n} className="rounded-md bg-accent/60 px-4 py-2 text-accent-foreground">
              {n}
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-vintage mt-8 flex flex-wrap items-center justify-between gap-4 p-6">
        <p className="text-sm text-foreground">
          Quer participar? Cadastre-se como ONG, Protetor Independente ou Adotante.
        </p>
        <Link
          to="/cadastro"
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Fazer cadastro
        </Link>
      </section>
    </SiteLayout>
  );
}
