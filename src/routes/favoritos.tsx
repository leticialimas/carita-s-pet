import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { BotaoFavorito } from "@/components/BotaoFavorito";
import { pets } from "@/data/pets";
import { removerAlerta, useAlertas, useFavoritos } from "@/lib/favoritos";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Meus favoritos | Carita's Pets" },
      {
        name: "description",
        content: "Sua lista privada de cães e gatos salvos e alertas de pet ideal em Brasília - DF.",
      },
      { property: "og:title", content: "Meus favoritos | Carita's Pets" },
      { property: "og:description", content: "Pets salvos e alertas de busca." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Favoritos,
});

const rotulos: Record<string, string> = {
  especie: "Espécie",
  idade: "Idade",
  regiao: "Região",
  porte: "Porte",
  sexo: "Sexo",
  especiais: "Necessidades especiais",
};

function Favoritos() {
  const favoritos = useFavoritos();
  const alertas = useAlertas();
  const lista = pets.filter((p) => favoritos.includes(p.id));

  return (
    <SiteLayout>
      <h1 className="text-3xl font-bold text-foreground">Meus favoritos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Lista privada — só você vê os pets salvos aqui. Quando decidir, inicie a conversa com o
        doador.
      </p>

      {lista.length === 0 ? (
        <div className="surface-vintage mt-6 p-8 text-center text-sm text-muted-foreground">
          Você ainda não salvou nenhum pet. Toque no coração dos cards em{" "}
          <Link to="/pets" className="text-primary underline underline-offset-4">
            Adotar
          </Link>{" "}
          para guardá-los aqui.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {lista.map((pet) => (
            <article key={pet.id} className="surface-vintage relative flex flex-col overflow-hidden">
              <img
                src={pet.foto}
                alt={`${pet.nome}, ${pet.especie === "cao" ? "cão" : "gato"} para adoção`}
                loading="lazy"
                className="h-48 w-full object-cover"
              />
              <BotaoFavorito petId={pet.id} nome={pet.nome} />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="text-lg font-semibold text-foreground">{pet.nome}</h2>
                <p className="text-sm text-muted-foreground">
                  {pet.idade} · porte {pet.porte} · {pet.cidade}
                </p>
                <Link
                  to="/chat"
                  search={{ pet: pet.id }}
                  className="mt-auto rounded-md bg-secondary px-4 py-2 text-center text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  Conversar com doador
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-foreground">Alertas de Pet Ideal</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Avisaremos você assim que uma ONG ou protetor cadastrar um pet com essas características.
        </p>
        {alertas.length === 0 ? (
          <p className="surface-vintage mt-4 p-6 text-sm text-muted-foreground">
            Nenhum alerta ativo. Em{" "}
            <Link to="/pets" className="text-primary underline underline-offset-4">
              Adotar
            </Link>
            , use o botão "Avise-me" junto aos filtros.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {alertas.map((a) => (
              <li key={a.id} className="surface-vintage flex items-start gap-3 p-5">
                <span aria-hidden className="text-xl">
                  🔔
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {Object.entries(a.criterios)
                      .map(([k, v]) => `${rotulos[k] ?? k}: ${v}`)
                      .join(" · ")}
                  </p>
                  <p className="text-xs text-muted-foreground">Ativo desde {a.criadoEm}</p>
                </div>
                <button
                  onClick={() => removerAlerta(a.id)}
                  className="text-xs text-primary underline underline-offset-4"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteLayout>
  );
}
