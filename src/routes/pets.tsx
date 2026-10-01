import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { BotaoFavorito } from "@/components/BotaoFavorito";
import { pets } from "@/data/pets";
import { regioesDF } from "@/data/regioes";
import { lerAdotante, type Adotante } from "@/lib/adotante";
import { doadorPorNome } from "@/data/doadores";
import { salvarAlerta } from "@/lib/favoritos";

export const Route = createFileRoute("/pets")({
  head: () => ({
    meta: [
      { title: "Pets para adoção | Carita's Pets" },
      {
        name: "description",
        content:
          "Catálogo exclusivo de cães e gatos disponíveis para adoção em Brasília - DF, com filtros por espécie, idade, porte, sexo e Região Administrativa.",
      },
      { property: "og:title", content: "Pets para adoção | Carita's Pets" },
      {
        property: "og:description",
        content: "Conheça cães e gatos disponíveis para adoção e converse com o doador.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pets,
});

const caixaFiltro =
  "rounded-lg border border-input bg-secondary/60 p-4 text-secondary-foreground shadow-sm";
const campo =
  "mt-2 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

function Pets() {
  const [adotante, setAdotante] = useState<Adotante | null>(null);
  const [carregado, setCarregado] = useState(false);

  const [especie, setEspecie] = useState("todos");
  const [idade, setIdade] = useState("todos");
  const [regiao, setRegiao] = useState("todas");
  const [porte, setPorte] = useState("todos");
  const [sexo, setSexo] = useState("todos");
  const [especiais, setEspeciais] = useState(false);
  const [alertaCriado, setAlertaCriado] = useState(false);

  useEffect(() => {
    setAdotante(lerAdotante());
    setCarregado(true);
  }, []);

  const regioesDisponiveis = useMemo(() => {
    const usadas = new Set(pets.map((p) => p.cidade));
    return regioesDF.filter((r) => usadas.has(r));
  }, []);

  const lista = pets.filter(
    (p) =>
      (especie === "todos" || p.especie === especie) &&
      (idade === "todos" || p.faixaEtaria === idade) &&
      (regiao === "todas" || p.cidade === regiao) &&
      (porte === "todos" || p.porte === porte) &&
      (sexo === "todos" || p.sexo === sexo) &&
      (!especiais || p.necessidadeEspecial !== null),
  );

  if (!carregado) return <SiteLayout>{null}</SiteLayout>;

  if (!adotante) {
    return (
      <SiteLayout>
        <div className="surface-vintage mx-auto max-w-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Área exclusiva de adotantes</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Para ver os pets disponíveis é preciso concluir o cadastro de Adotante, incluindo o
            envio do comprovante de residência.
          </p>
          <Link
            to="/cadastro"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Fazer cadastro de adotante
          </Link>
        </div>
      </SiteLayout>
    );
  }

  function limpar() {
    setEspecie("todos");
    setIdade("todos");
    setRegiao("todas");
    setPorte("todos");
    setSexo("todos");
    setEspeciais(false);
    setAlertaCriado(false);
  }

  const criterios: Record<string, string> = {};
  if (especie !== "todos") criterios["especie"] = especie === "cao" ? "Cão" : "Gato";
  if (idade !== "todos") criterios["idade"] = idade;
  if (regiao !== "todas") criterios["regiao"] = regiao;
  if (porte !== "todos") criterios["porte"] = porte;
  if (sexo !== "todos") criterios["sexo"] = sexo;
  if (especiais) criterios["especiais"] = "Sim";
  const temFiltro = Object.keys(criterios).length > 0;

  function avisar() {
    salvarAlerta(criterios);
    setAlertaCriado(true);
  }

  const botaoAvise = (
    <div className="rounded-lg border border-dashed border-primary/60 bg-card p-4 text-sm">
      <p className="font-semibold text-primary">🔔 Alerta de Pet Ideal</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Não achou o perfil que procura? Ative um alerta e avisaremos quando uma ONG cadastrar um
        pet com essas características.
      </p>
      {alertaCriado ? (
        <p className="mt-3 rounded-md bg-secondary/60 px-3 py-2 text-xs text-secondary-foreground">
          Alerta ativado! Veja em{" "}
          <Link to="/favoritos" className="underline underline-offset-4">
            Favoritos
          </Link>
          .
        </p>
      ) : (
        <button
          onClick={avisar}
          disabled={!temFiltro}
          title={temFiltro ? undefined : "Selecione ao menos um filtro"}
          className="mt-3 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Avise-me
        </button>
      )}
    </div>
  );

  return (
    <SiteLayout>
      <h1 className="text-3xl font-bold text-foreground">Pets disponíveis</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Olá, {adotante.nome || "adotante"}! Use os filtros para encontrar um pet perto de você.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className={caixaFiltro}>
            <p className="text-sm font-bold">Localização</p>
            <label className="mt-2 block text-xs">
              Região Administrativa do DF
              <select value={regiao} onChange={(e) => setRegiao(e.target.value)} className={campo}>
                <option value="todas">Todas as regiões</option>
                {regioesDisponiveis.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={caixaFiltro}>
            <p className="text-sm font-bold">Sobre o pet</p>
            <label className="mt-2 block text-xs">
              Espécie
              <select value={especie} onChange={(e) => setEspecie(e.target.value)} className={campo}>
                <option value="todos">Todas</option>
                <option value="cao">Cães</option>
                <option value="gato">Gatos</option>
              </select>
            </label>
            <label className="mt-3 block text-xs">
              Idade
              <select value={idade} onChange={(e) => setIdade(e.target.value)} className={campo}>
                <option value="todos">Todas</option>
                <option value="Filhote">Filhote</option>
                <option value="Adulto">Adulto</option>
                <option value="Idoso">Idoso</option>
              </select>
            </label>
            <label className="mt-3 block text-xs">
              Porte
              <select value={porte} onChange={(e) => setPorte(e.target.value)} className={campo}>
                <option value="todos">Todos</option>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </label>
            <label className="mt-3 block text-xs">
              Sexo
              <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={campo}>
                <option value="todos">Todos</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </label>
            <label className="mt-3 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={especiais}
                onChange={(e) => setEspeciais(e.target.checked)}
                className="h-4 w-4"
              />
              Somente necessidades especiais
            </label>
          </div>

          <button
            onClick={limpar}
            className="w-full rounded-md border border-input bg-card px-4 py-2 text-sm text-foreground hover:bg-accent"
          >
            Limpar filtros
          </button>

          {botaoAvise}
        </aside>

        <div>
          <p className="text-sm text-muted-foreground">
            {lista.length} {lista.length === 1 ? "pet encontrado" : "pets encontrados"}
          </p>

          {lista.length === 0 && (
            <div className="surface-vintage mt-4 space-y-4 p-6 text-sm text-muted-foreground">
              <p>Nenhum pet corresponde a essa combinação de filtros. Tente ampliar a busca.</p>
              {botaoAvise}
            </div>
          )}

          <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {lista.map((pet) => (
              <article key={pet.id} className="surface-vintage relative flex flex-col overflow-hidden">
                <img
                  src={pet.foto}
                  alt={`${pet.nome}, ${pet.especie === "cao" ? "cão" : "gato"} para adoção em ${pet.cidade}`}
                  loading="lazy"
                  className="h-52 w-full object-cover"
                />
                <BotaoFavorito petId={pet.id} nome={pet.nome} />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2 className="text-xl font-semibold text-foreground">{pet.nome}</h2>
                  <p className="text-sm text-muted-foreground">
                    {pet.idade} · {pet.sexo} · porte {pet.porte} · {pet.cidade}
                  </p>
                  {pet.necessidadeEspecial && (
                    <p className="w-fit rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      Necessidade especial: {pet.necessidadeEspecial}
                    </p>
                  )}
                  <p className="text-sm text-foreground">{pet.descricao}</p>
                  <p className="text-xs text-muted-foreground">
                    Doador:{" "}
                    {doadorPorNome(pet.doador) ? (
                      <Link
                        to="/doadores/$doadorId"
                        params={{ doadorId: doadorPorNome(pet.doador)!.id }}
                        className="text-primary underline underline-offset-4"
                      >
                        {pet.doador}
                      </Link>
                    ) : (
                      pet.doador
                    )}{" "}
                    ({pet.tipoDoador}) · {pet.credito}
                  </p>
                  <Link
                    to="/chat"
                    search={{ pet: pet.id }}
                    className="mt-auto rounded-md bg-secondary px-4 py-2 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    Tenho interesse / Conversar com doador
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
