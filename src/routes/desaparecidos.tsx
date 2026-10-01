import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { regioesDF } from "@/data/regioes";
import {
  lerDesaparecidos,
  salvarDesaparecido,
  type Desaparecido,
} from "@/data/desaparecidos";
import { arquivoParaDataUrl } from "@/lib/adotante";
import { mascaraTelefone, somenteDigitos } from "@/lib/validacao";

export const Route = createFileRoute("/desaparecidos")({
  head: () => ({
    meta: [
      { title: "Alerta Pet DF | Animais desaparecidos em Brasília" },
      {
        name: "description",
        content:
          "Central de utilidade pública para anunciar e procurar cães e gatos desaparecidos nas Regiões Administrativas do Distrito Federal.",
      },
      { property: "og:title", content: "Alerta Pet DF | Animais desaparecidos" },
      {
        property: "og:description",
        content:
          "Anuncie um pet desaparecido, filtre por região administrativa e compartilhe o cartaz Procura-se.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Desaparecidos,
});

const input =
  "mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";
const caixaFiltro =
  "rounded-lg border border-input bg-secondary/60 p-4 text-secondary-foreground shadow-sm";

function Desaparecidos() {
  const [lista, setLista] = useState<Desaparecido[]>([]);
  const [form, setForm] = useState(false);
  const [especie, setEspecie] = useState("todos");
  const [regiao, setRegiao] = useState("todas");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    setLista(lerDesaparecidos());
  }, []);

  const filtrados = lista.filter(
    (d) =>
      (especie === "todos" || d.especie === especie) &&
      (regiao === "todas" || d.regiao === regiao) &&
      (busca.trim() === "" ||
        `${d.nome} ${d.racaCor} ${d.caracteristicas}`
          .toLowerCase()
          .includes(busca.trim().toLowerCase())),
  );

  return (
    <SiteLayout>
      <section className="surface-vintage flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerta Pet DF</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Central de utilidade pública para reunir famílias e pets perdidos no Distrito Federal.
          </p>
        </div>
        <button
          onClick={() => setForm((f) => !f)}
          className="rounded-lg bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          {form ? "Fechar formulário" : "Anunciar Pet Desaparecido"}
        </button>
      </section>

      {form && (
        <FormularioDesaparecido
          onCriar={(d) => {
            salvarDesaparecido(d);
            setLista((l) => [d, ...l]);
            setForm(false);
          }}
        />
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className={caixaFiltro}>
            <p className="text-sm font-bold">Onde sumiu</p>
            <label className="mt-2 block text-xs">
              Região Administrativa
              <select value={regiao} onChange={(e) => setRegiao(e.target.value)} className={input}>
                <option value="todas">Todas as regiões</option>
                {regioesDF.map((r) => (
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
              <select
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
                className={input}
              >
                <option value="todos">Todas</option>
                <option value="cao">Cães</option>
                <option value="gato">Gatos</option>
              </select>
            </label>
            <label className="mt-3 block text-xs">
              Raça / cor / característica
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Ex.: caramelo, coleira vermelha"
                className={input}
              />
            </label>
          </div>
        </aside>

        <div>
          <p className="text-sm text-muted-foreground">
            {filtrados.length} {filtrados.length === 1 ? "anúncio" : "anúncios"}
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {filtrados.map((d) => (
              <CardDesaparecido key={d.id} pet={d} />
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function CardDesaparecido({ pet }: { pet: Desaparecido }) {
  const [gerando, setGerando] = useState(false);
  const link =
    typeof window !== "undefined" ? `${window.location.origin}/desaparecidos` : "/desaparecidos";
  const textoShare = `PROCURA-SE 🐾 ${pet.nome} (${pet.racaCor}) desapareceu em ${pet.regiao} no dia ${pet.data}. Visto pela última vez: ${pet.localVisto}. Contato do tutor: ${mascaraTelefone(pet.telefone.slice(2))}. Veja em ${link}`;

  async function gerarCartaz() {
    setGerando(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      for (let x = 0; x < 1080; x += 44) {
        ctx.fillStyle = "#EBF4F6";
        ctx.fillRect(x, 0, 22, 1080);
        ctx.fillStyle = "#E6F2FF";
        ctx.fillRect(x + 22, 0, 22, 1080);
      }

      ctx.fillStyle = "#A0522D";
      ctx.fillRect(0, 0, 1080, 140);
      ctx.fillStyle = "#FFFB95";
      ctx.font = "bold 84px 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.fillText("PROCURA-SE", 540, 100);

      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = pet.foto;
      });
      if (img.width) {
        const lado = Math.min(img.width, img.height);
        ctx.drawImage(
          img,
          (img.width - lado) / 2,
          (img.height - lado) / 2,
          lado,
          lado,
          140,
          180,
          800,
          560,
        );
      }
      ctx.strokeStyle = "#FFB6C1";
      ctx.lineWidth = 10;
      ctx.strokeRect(140, 180, 800, 560);

      ctx.fillStyle = "#5A3016";
      ctx.font = "bold 66px 'Times New Roman', serif";
      ctx.fillText(pet.nome, 540, 830);
      ctx.font = "40px 'Times New Roman', serif";
      ctx.fillText(`${pet.racaCor} · ${pet.regiao}`, 540, 890);
      ctx.fillText(`Desaparecido em ${pet.data}`, 540, 945);
      ctx.font = "bold 44px 'Times New Roman', serif";
      ctx.fillText(`Contato: ${mascaraTelefone(pet.telefone.slice(2))}`, 540, 1005);
      ctx.font = "32px 'Times New Roman', serif";
      ctx.fillStyle = "#A0522D";
      ctx.fillText("Carita's Pets · Brasília - DF", 540, 1055);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `procura-se-${pet.id}.png`;
      a.click();
    } finally {
      setGerando(false);
    }
  }

  return (
    <article className="relative overflow-hidden rounded-lg border-2 border-dashed border-destructive/60 bg-card/90 shadow-sm">
      <span className="absolute top-6 -left-10 z-10 w-40 rotate-[-35deg] bg-accent py-1 text-center text-xs font-bold tracking-widest text-accent-foreground shadow">
        PROCURA-SE
      </span>
      <img
        src={pet.foto}
        alt={`${pet.nome}, ${pet.especie === "cao" ? "cão" : "gato"} desaparecido em ${pet.regiao}`}
        loading="lazy"
        className="h-56 w-full object-cover"
      />
      <div className="space-y-2 p-5">
        <h2 className="text-xl font-semibold text-foreground">{pet.nome}</h2>
        <p className="text-sm text-muted-foreground">
          {pet.racaCor} · sumiu em {pet.data}
        </p>
        <p className="text-sm text-foreground">
          <strong>Visto por último:</strong> {pet.localVisto} ({pet.regiao})
        </p>
        <p className="text-sm text-foreground">{pet.caracteristicas}</p>
        <p className="text-sm text-foreground">
          <strong>Tutor:</strong> {pet.tutor} · {mascaraTelefone(pet.telefone.slice(2))}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href={`https://wa.me/${pet.telefone}?text=${encodeURIComponent(`Olá ${pet.tutor}, vi o anúncio do(a) ${pet.nome} no Carita's Pets e tenho informações.`)}`}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Falar com o tutor
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(textoShare)}`}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md border border-input bg-accent px-4 py-2 text-sm text-accent-foreground hover:bg-accent/70"
          >
            Compartilhar no WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(textoShare)}`}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md border border-input bg-accent px-4 py-2 text-sm text-accent-foreground hover:bg-accent/70"
          >
            Compartilhar no Facebook
          </a>
          <button
            onClick={() => void gerarCartaz()}
            disabled={gerando}
            className="rounded-md border border-input bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:bg-secondary/80 disabled:opacity-60"
          >
            {gerando ? "Gerando..." : "Baixar cartaz p/ Instagram"}
          </button>
        </div>
      </div>
    </article>
  );
}

function FormularioDesaparecido({ onCriar }: { onCriar: (d: Desaparecido) => void }) {
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState<"cao" | "gato">("cao");
  const [racaCor, setRacaCor] = useState("");
  const [regiao, setRegiao] = useState<string>(regioesDF[0]);
  const [localVisto, setLocalVisto] = useState("");
  const [data, setData] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");
  const [tutor, setTutor] = useState("");
  const [telefone, setTelefone] = useState("");
  const [foto, setFoto] = useState("");
  const [erros, setErros] = useState<string[]>([]);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const faltando: string[] = [];
    if (!foto) faltando.push("Foto recente");
    if (!nome.trim()) faltando.push("Nome");
    if (!data) faltando.push("Data do sumiço");
    if (!caracteristicas.trim()) faltando.push("Características marcantes");
    if (somenteDigitos(telefone).length < 10) faltando.push("Telefone do tutor");
    if (!tutor.trim()) faltando.push("Nome do tutor");
    if (!localVisto.trim()) faltando.push("Local visto pela última vez");
    setErros(faltando);
    if (faltando.length) return;

    onCriar({
      id: String(Date.now()),
      nome: nome.trim(),
      especie,
      racaCor: racaCor.trim() || (especie === "cao" ? "SRD" : "SRD"),
      regiao,
      localVisto: localVisto.trim(),
      data: new Date(data + "T12:00:00").toLocaleDateString("pt-BR"),
      caracteristicas: caracteristicas.trim(),
      tutor: tutor.trim(),
      telefone: "55" + somenteDigitos(telefone),
      foto,
    });
  }

  return (
    <form onSubmit={enviar} className="surface-vintage mt-6 space-y-4 p-6">
      <h2 className="text-xl font-semibold text-foreground">Anunciar pet desaparecido</h2>
      {erros.length > 0 && (
        <p className="rounded-md border border-destructive bg-card p-3 text-sm text-destructive">
          Preencha os campos obrigatórios: {erros.join(", ")}.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-foreground">
          Foto recente *
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) setFoto(await arquivoParaDataUrl(f));
            }}
            className={input}
          />
        </label>
        <label className="text-sm text-foreground">
          Nome do pet *
          <input value={nome} onChange={(e) => setNome(e.target.value)} className={input} />
        </label>
        <label className="text-sm text-foreground">
          Espécie *
          <select
            value={especie}
            onChange={(e) => setEspecie(e.target.value as "cao" | "gato")}
            className={input}
          >
            <option value="cao">Cão</option>
            <option value="gato">Gato</option>
          </select>
        </label>
        <label className="text-sm text-foreground">
          Raça / cor
          <input value={racaCor} onChange={(e) => setRacaCor(e.target.value)} className={input} />
        </label>
        <label className="text-sm text-foreground">
          Região Administrativa do sumiço *
          <select value={regiao} onChange={(e) => setRegiao(e.target.value)} className={input}>
            {regioesDF.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-foreground">
          Local visto pela última vez *
          <input
            value={localVisto}
            onChange={(e) => setLocalVisto(e.target.value)}
            className={input}
          />
        </label>
        <label className="text-sm text-foreground">
          Data do sumiço *
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={input}
          />
        </label>
        <label className="text-sm text-foreground">
          Nome do tutor *
          <input value={tutor} onChange={(e) => setTutor(e.target.value)} className={input} />
        </label>
        <label className="text-sm text-foreground">
          WhatsApp para contato *
          <input
            value={telefone}
            onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
            placeholder="(61) 99999-0000"
            className={input}
          />
        </label>
        <label className="text-sm text-foreground md:col-span-2">
          Características marcantes *
          <textarea
            rows={3}
            value={caracteristicas}
            onChange={(e) => setCaracteristicas(e.target.value)}
            placeholder="Coleira, manchas, comportamento, se atende pelo nome..."
            className={input}
          />
        </label>
      </div>
      {foto && <img src={foto} alt="Pré-visualização" className="h-32 w-32 rounded-md object-cover" />}
      <button
        type="submit"
        className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
      >
        Publicar alerta
      </button>
    </form>
  );
}
