import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { diarios, type DiarioPet, type PostDiario } from "@/data/diario";
import { arquivoParaDataUrl, lerAdotante } from "@/lib/adotante";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { title: "Finais Felizes: Diário do Pet | Carita's Pets" },
      {
        name: "description",
        content:
          "Diário de adoção em formato de stories: adotantes do DF compartilham o dia a dia dos pets e as ONGs acompanham o bem-estar dos animais.",
      },
      { property: "og:title", content: "Finais Felizes: Diário do Pet | Carita's Pets" },
      {
        property: "og:description",
        content: "Fotos e vídeos curtos do dia a dia dos animais já adotados pela plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Diario,
});

const KEY_VISTOS = "caritas-pets-diario-vistos";
const KEY_POSTS = "caritas-pets-diario-posts";

function Diario() {
  const [vistos, setVistos] = useState<string[]>([]);
  const [extras, setExtras] = useState<Record<string, PostDiario[]>>({});
  const [aberto, setAberto] = useState<number | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [nomeAdotante, setNomeAdotante] = useState<string | null>(null);

  useEffect(() => {
    try {
      setVistos(JSON.parse(localStorage.getItem(KEY_VISTOS) ?? "[]") as string[]);
      setExtras(JSON.parse(localStorage.getItem(KEY_POSTS) ?? "{}") as Record<string, PostDiario[]>);
    } catch {
      /* ignora */
    }
    setNomeAdotante(lerAdotante()?.nome ?? null);
  }, []);

  const lista: DiarioPet[] = useMemo(
    () => diarios.map((d) => ({ ...d, posts: [...d.posts, ...(extras[d.id] ?? [])] })),
    [extras],
  );

  function marcarVisto(id: string) {
    setVistos((v) => {
      if (v.includes(id)) return v;
      const novo = [...v, id];
      localStorage.setItem(KEY_VISTOS, JSON.stringify(novo));
      return novo;
    });
  }

  async function publicar(petId: string, arquivo: File, legenda: string) {
    const midia = await arquivoParaDataUrl(arquivo);
    const post: PostDiario = {
      id: `${petId}-${Date.now()}`,
      tipo: arquivo.type.startsWith("video") ? "video" : "foto",
      midia,
      legenda,
      data: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" }),
    };
    setExtras((e) => {
      const novo = { ...e, [petId]: [...(e[petId] ?? []), post] };
      localStorage.setItem(KEY_POSTS, JSON.stringify(novo));
      return novo;
    });
    const doador = diarios.find((d) => d.id === petId)?.doador ?? "o doador";
    setAviso(`Atualização publicada! ${doador} foi notificado(a) e já pode acompanhar.`);
  }

  return (
    <SiteLayout>
      <h1 className="text-3xl font-bold text-foreground">Finais Felizes — Diário do Pet</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        O dia a dia dos animais depois da adoção. Toque no retrato de um pet para ver as
        atualizações em tela cheia; quem doou recebe um aviso a cada nova publicação.
      </p>

      <section aria-label="Atualizações recentes" className="surface-vintage mt-6 overflow-x-auto p-4">
        <ul className="flex gap-5">
          {lista.map((d, i) => {
            const novo = !vistos.includes(d.id);
            return (
              <li key={d.id} className="shrink-0 text-center">
                <button
                  onClick={() => {
                    setAberto(i);
                    marcarVisto(d.id);
                  }}
                  className="block"
                  aria-label={`Ver diário de ${d.pet}`}
                >
                  <span
                    className={`block rounded-full p-[3px] ${
                      novo ? "bg-secondary" : "bg-border"
                    }`}
                  >
                    <img
                      src={d.avatar}
                      alt={d.pet}
                      loading="lazy"
                      className="h-[72px] w-[72px] rounded-full border-2 border-card object-cover"
                    />
                  </span>
                  <span className="mt-1.5 block text-xs text-foreground">{d.pet}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {aviso && (
        <p role="status" className="mt-4 rounded-md border border-primary/30 bg-accent px-4 py-3 text-sm text-accent-foreground">
          {aviso}
        </p>
      )}

      <PublicarAtualizacao pets={lista} onPublicar={publicar} nome={nomeAdotante} />

      <h2 className="mt-10 text-2xl font-semibold text-foreground">Álbum da comunidade</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.flatMap((d) =>
          d.posts.map((p) => (
            <figure key={p.id} className="bg-white p-3 pb-10 shadow-md">
              {p.tipo === "video" ? (
                <video src={p.midia} controls className="h-56 w-full bg-black object-cover" />
              ) : (
                <img src={p.midia} alt={p.legenda} loading="lazy" className="h-56 w-full object-cover" />
              )}
              <figcaption className="mt-3 text-center text-sm text-neutral-700">
                <strong className="text-primary">{d.pet}</strong> · {p.legenda}
                <span className="mt-1 block text-xs text-neutral-500">{p.data}</span>
              </figcaption>
            </figure>
          )),
        )}
      </div>

      {aberto !== null && lista[aberto] && (
        <VisualizadorStories
          diario={lista[aberto]}
          onFechar={() => setAberto(null)}
          onProximo={() => {
            const prox = aberto + 1;
            if (prox < lista.length) {
              setAberto(prox);
              marcarVisto(lista[prox]!.id);
            } else setAberto(null);
          }}
        />
      )}
    </SiteLayout>
  );
}

function PublicarAtualizacao({
  pets,
  nome,
  onPublicar,
}: {
  pets: DiarioPet[];
  nome: string | null;
  onPublicar: (petId: string, arquivo: File, legenda: string) => void;
}) {
  const [petId, setPetId] = useState(pets[0]?.id ?? "");
  const [legenda, setLegenda] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!arquivo) return;
        onPublicar(petId, arquivo, legenda || "Nova atualização");
        setLegenda("");
        setArquivo(null);
      }}
      className="surface-vintage mt-6 grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end"
    >
      <label className="block text-sm text-foreground">
        {nome ? `${nome.split(" ")[0]}, escolha o pet` : "Escolha o pet"}
        <select
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.pet}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-foreground">
        Legenda
        <input
          value={legenda}
          onChange={(e) => setLegenda(e.target.value)}
          placeholder="Um dia bom por aqui..."
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        <button
          type="submit"
          disabled={!arquivo}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Publicar
        </button>
      </div>
    </form>
  );
}

function VisualizadorStories({
  diario,
  onFechar,
  onProximo,
}: {
  diario: DiarioPet;
  onFechar: () => void;
  onProximo: () => void;
}) {
  const [indice, setIndice] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const pausado = useRef(false);

  useEffect(() => {
    setIndice(0);
  }, [diario.id]);

  useEffect(() => {
    setProgresso(0);
    const passo = setInterval(() => {
      if (pausado.current) return;
      setProgresso((p) => {
        if (p >= 100) {
          if (indice + 1 < diario.posts.length) setIndice(indice + 1);
          else onProximo();
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(passo);
  }, [indice, diario.posts.length, onProximo]);

  const post = diario.posts[indice];
  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/80 p-4"
      onPointerDown={() => (pausado.current = true)}
      onPointerUp={() => (pausado.current = false)}
    >
      <div className="relative flex h-full max-h-[85vh] w-full max-w-sm flex-col overflow-hidden rounded-xl bg-card">
        <div className="flex gap-1 p-2">
          {diario.posts.map((p, i) => (
            <span key={p.id} className="h-1 flex-1 overflow-hidden rounded-full bg-border">
              <span
                className="block h-full bg-secondary"
                style={{ width: i < indice ? "100%" : i === indice ? `${progresso}%` : "0%" }}
              />
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 pb-2">
          <img src={diario.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{diario.pet}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {diario.adotante} · {post.data}
            </p>
          </div>
          <button onClick={onFechar} aria-label="Fechar" className="ml-auto text-muted-foreground">
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className="relative flex-1 bg-white p-3 pb-12">
          {post.tipo === "video" ? (
            <video src={post.midia} autoPlay muted controls className="h-full w-full bg-black object-cover" />
          ) : (
            <img src={post.midia} alt={post.legenda} className="h-full w-full object-cover" />
          )}
          <p className="absolute inset-x-3 bottom-3 text-center text-sm text-neutral-700">
            {post.legenda}
          </p>
        </div>

        <div className="flex">
          <button
            onClick={() => setIndice((i) => Math.max(0, i - 1))}
            className="flex-1 py-3 text-sm text-muted-foreground"
          >
            Anterior
          </button>
          <button
            onClick={() =>
              indice + 1 < diario.posts.length ? setIndice(indice + 1) : onProximo()
            }
            className="flex-1 py-3 text-sm text-primary"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
