import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck, Mic, Paperclip, Pause, Pin, Play, Square, X } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { pets } from "@/data/pets";
import { arquivoParaDataUrl, lerAdotante, type Adotante } from "@/lib/adotante";
import { lerConfigBot, salvarConfigBot, type ConfigBot, configBotPadrao } from "@/lib/bot";

export const Route = createFileRoute("/chat")({
  validateSearch: (search: Record<string, unknown>) => ({
    pet: typeof search["pet"] === "string" ? (search["pet"] as string) : pets[0]!.id,
  }),
  head: () => ({
    meta: [
      { title: "Conversas com doadores | Carita's Pets" },
      {
        name: "description",
        content:
          "Chat moderno com assistente virtual de triagem entre adotantes, ONGs e protetores independentes do Distrito Federal.",
      },
      { property: "og:title", content: "Conversas com doadores | Carita's Pets" },
      {
        property: "og:description",
        content: "Chat direto entre adotantes e doadores da plataforma Carita's Pets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Chat,
});

type Anexo = { tipo: "imagem" | "video" | "pdf"; url: string; nome: string };

type Msg = {
  id?: string;
  de: "adotante" | "doador" | "bot";
  texto: string;
  hora: string;
  opcoes?: string[];
  anexo?: Anexo;
  audioSegundos?: number;
  status?: "enviado" | "entregue" | "lido";
};

function novoId() {
  return `m${Date.now()}${Math.random().toString(16).slice(2, 6)}`;
}

function StatusLeitura({ status }: { status: NonNullable<Msg["status"]> }) {
  const rotulo = status === "enviado" ? "Enviado" : status === "entregue" ? "Entregue" : "Lido";
  return (
    <span
      title={rotulo}
      aria-label={rotulo}
      className={`ml-1 inline-flex items-center ${status === "lido" ? "text-primary" : "opacity-60"}`}
    >
      {status === "enviado" ? (
        <Check size={13} strokeWidth={2} aria-hidden />
      ) : (
        <CheckCheck size={13} strokeWidth={2} aria-hidden />
      )}
    </span>
  );
}

function PlayerAudio({ segundos }: { segundos: number }) {
  const [tocando, setTocando] = useState(false);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (!tocando) return;
    const i = setInterval(() => {
      setPos((p) => {
        if (p + 1 >= segundos) {
          setTocando(false);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(i);
  }, [tocando, segundos]);

  return (
    <div className="flex min-w-[11rem] items-center gap-2">
      <button
        type="button"
        onClick={() => setTocando((t) => !t)}
        aria-label={tocando ? "Pausar áudio" : "Tocar áudio"}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        {tocando ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
      </button>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent">
        <span
          className="block h-full rounded-full bg-secondary"
          style={{ width: `${(pos / segundos) * 100}%` }}
        />
      </span>
      <span className="text-[11px] tabular-nums opacity-70">
        0:{String(Math.max(0, segundos - pos)).padStart(2, "0")}
      </span>
    </div>
  );
}

function agora() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function Chat() {
  const { pet: petId } = Route.useSearch();
  const navigate = useNavigate();
  const [adotante, setAdotante] = useState<Adotante | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [config, setConfig] = useState<ConfigBot>(configBotPadrao);
  const [painel, setPainel] = useState(false);
  const [texto, setTexto] = useState("");
  const [conversas, setConversas] = useState<Record<string, Msg[]>>({});
  const [etapa, setEtapa] = useState<Record<string, number>>({});
  const [fixadas, setFixadas] = useState<Record<string, string>>({});
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const fim = useRef<HTMLDivElement>(null);
  const arquivoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!gravando) return;
    const i = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [gravando]);

  const pet = pets.find((p) => p.id === petId) ?? pets[0]!;

  useEffect(() => {
    setAdotante(lerAdotante());
    setConfig(lerConfigBot());
    setCarregado(true);
  }, []);

  // Abertura automática do bot para a conversa selecionada.
  useEffect(() => {
    if (!carregado || !adotante) return;
    setConversas((c) => {
      if (c[pet.id]) return c;
      if (!config.ativo) {
        return {
          ...c,
          [pet.id]: [
            {
              de: "doador",
              texto: `Olá! Aqui é ${pet.doador}. Que bom que você se interessou por ${pet.nome}.`,
              hora: agora(),
            },
          ],
        };
      }
      return {
        ...c,
        [pet.id]: [
          { de: "bot", texto: config.saudacao.replace("{pet}", pet.nome), hora: agora() },
          {
            de: "bot",
            texto: `Ficha resumo de ${pet.nome}: ${pet.idade}, ${pet.sexo}, porte ${pet.porte}, ${pet.cidade}. ${pet.ficha.join(" · ")}.`,
            hora: agora(),
          },
          {
            de: "bot",
            texto:
              "Para continuarmos, você confirma que leu todas as informações e tem disponibilidade financeira e de tempo para cuidar dele(a) por até 15 anos?",
            hora: agora(),
            opcoes: ["Sim, confirmo", "Apenas olhando"],
          },
        ],
      };
    });
  }, [carregado, adotante, pet.id, config]);

  const msgs = conversas[pet.id] ?? [];

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length, pet.id]);

  if (!carregado) return <SiteLayout>{null}</SiteLayout>;

  if (!adotante) {
    return (
      <SiteLayout>
        <div className="surface-vintage mx-auto max-w-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Chat exclusivo para cadastrados</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Conclua o cadastro de Adotante para conversar com ONGs e protetores.
          </p>
          <Link
            to="/cadastro"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Fazer cadastro
          </Link>
        </div>
      </SiteLayout>
    );
  }

  function anexar(id: string, novas: Msg[]) {
    setConversas((c) => ({ ...c, [id]: [...(c[id] ?? []), ...novas] }));
  }

  function atualizarStatus(conversa: string, msgId: string, status: NonNullable<Msg["status"]>) {
    setConversas((c) => ({
      ...c,
      [conversa]: (c[conversa] ?? []).map((m) => (m.id === msgId ? { ...m, status } : m)),
    }));
  }

  // Mensagem do adotante: nasce como "Enviado" e evolui para "Entregue" e "Lido".
  function enviarDoAdotante(conversa: string, parcial: Omit<Msg, "de" | "hora" | "status" | "id">) {
    const id = novoId();
    anexar(conversa, [{ ...parcial, id, de: "adotante", hora: agora(), status: "enviado" }]);
    setTimeout(() => atualizarStatus(conversa, id, "entregue"), 700);
    setTimeout(() => atualizarStatus(conversa, id, "lido"), 2200);
  }

  async function anexarArquivo(file: File) {
    const url = await arquivoParaDataUrl(file);
    const tipo: Anexo["tipo"] = file.type.startsWith("image")
      ? "imagem"
      : file.type.startsWith("video")
        ? "video"
        : "pdf";
    enviarDoAdotante(pet.id, {
      texto: "",
      anexo: { tipo, url, nome: file.name },
    });
    responderTriagem(pet.id);
  }

  function finalizarAudio(segundos: number) {
    if (segundos < 1) return;
    enviarDoAdotante(pet.id, { texto: "", audioSegundos: segundos });
    responderTriagem(pet.id);
  }

  function responderTriagem(id: string) {
    const passo = etapa[id] ?? 0;
    if (passo < config.perguntas.length) {
      setEtapa((e) => ({ ...e, [id]: passo + 1 }));
      setTimeout(
        () => anexar(id, [{ de: "bot", texto: config.perguntas[passo]!, hora: agora() }]),
        700,
      );
    } else if (passo === config.perguntas.length) {
      setEtapa((e) => ({ ...e, [id]: passo + 1 }));
      setTimeout(
        () =>
          anexar(id, [
            {
              de: "bot",
              texto: "Obrigado! Triagem concluída. Estou transferindo você para o responsável.",
              hora: agora(),
            },
            {
              de: "doador",
              texto: `Oi, ${adotante!.nome.split(" ")[0]}! Aqui é ${pet.doador}. Li suas respostas e seu perfil de adotante. Podemos marcar uma visita virtual esta semana?`,
              hora: agora(),
            },
          ]),
        1100,
      );
    } else {
      setTimeout(
        () =>
          anexar(id, [
            {
              de: "doador",
              texto: `Perfeito! Vou verificar e já te retorno sobre ${pet.nome}.`,
              hora: agora(),
            },
          ]),
        900,
      );
    }
  }

  function escolher(opcao: string) {
    enviarDoAdotante(pet.id, { texto: opcao });
    if (opcao === "Apenas olhando") {
      setTimeout(
        () =>
          anexar(pet.id, [
            {
              de: "bot",
              texto:
                "Sem problemas! Fico por aqui caso mude de ideia. Você pode continuar navegando pelo catálogo. 🐾",
              hora: agora(),
            },
          ]),
        700,
      );
      setEtapa((e) => ({ ...e, [pet.id]: 99 }));
      return;
    }
    responderTriagem(pet.id);
  }

  function enviar(valorBruto: string) {
    const valor = valorBruto.trim();
    if (!valor) return;
    enviarDoAdotante(pet.id, { texto: valor });
    setTexto("");
    responderTriagem(pet.id);
  }

  const ultima = msgs[msgs.length - 1];

  return (
    <SiteLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Conversas</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Assistente virtual faz a triagem inicial e depois a ONG ou protetor assume o chat.
          </p>
        </div>
        <button
          onClick={() => setPainel((p) => !p)}
          className="rounded-md border border-input bg-accent px-4 py-2 text-sm text-accent-foreground hover:bg-accent/80"
        >
          {painel ? "Fechar painel do bot" : "Painel do bot (ONG/Protetor)"}
        </button>
      </div>

      {painel && <PainelBot config={config} onSalvar={setConfig} />}

      <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr]">
        <aside className="surface-vintage max-h-[560px] overflow-y-auto p-3">
          {pets.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate({ to: "/chat", search: { pet: p.id } })}
              className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                p.id === pet.id ? "bg-secondary text-secondary-foreground" : "hover:bg-accent"
              }`}
            >
              <img
                src={p.foto}
                alt={p.nome}
                loading="lazy"
                className="h-11 w-11 rounded-full object-cover"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{p.nome}</span>
                <span className="block truncate text-xs text-muted-foreground">{p.doador}</span>
              </span>
            </button>
          ))}
        </aside>

        <section className="surface-vintage flex h-[560px] flex-col overflow-hidden">
          <header className="flex items-center gap-3 border-b border-border bg-card/70 p-4">
            <img src={pet.foto} alt={pet.nome} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-foreground">{pet.doador}</p>
              <p className="text-xs text-muted-foreground">
                Sobre {pet.nome} · {pet.tipoDoador}
              </p>
            </div>
            <span className="ml-auto rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
              {config.ativo ? "Assistente ativo" : "Somente humano"}
            </span>
          </header>

          {fixadas[pet.id] && (
            <div className="flex items-start gap-2 border-b border-border bg-accent px-4 py-2 text-xs text-accent-foreground">
              <Pin size={14} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0 text-primary" />
              <p className="flex-1 whitespace-pre-line">{fixadas[pet.id]}</p>
              <button
                onClick={() => setFixadas((f) => ({ ...f, [pet.id]: "" }))}
                aria-label="Desafixar mensagem"
                className="text-primary"
              >
                <X size={14} aria-hidden />
              </button>
            </div>
          )}

          <div className="flex-1 space-y-3 overflow-y-auto p-4 leading-relaxed">
            <p className="mx-auto w-fit rounded-full bg-card px-3 py-1 text-xs text-muted-foreground">
              Seu perfil de adotante foi compartilhado com {pet.doador}
            </p>
            {msgs.map((m, i) => (
              <div
                key={m.id ?? i}
                className={`group flex items-center gap-1 ${m.de === "adotante" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    m.de === "adotante"
                      ? "rounded-br-sm bg-secondary text-secondary-foreground"
                      : "rounded-bl-sm border border-border bg-card text-card-foreground"
                  }`}
                >
                  {m.de === "bot" && (
                    <p className="mb-1 text-[11px] font-semibold text-primary">
                      🤖 Assistente Carita&apos;s
                    </p>
                  )}

                  {m.anexo?.tipo === "imagem" && (
                    <img
                      src={m.anexo.url}
                      alt={m.anexo.nome}
                      className="mb-1 max-h-56 rounded-lg object-cover"
                    />
                  )}
                  {m.anexo?.tipo === "video" && (
                    <video src={m.anexo.url} controls className="mb-1 max-h-56 rounded-lg" />
                  )}
                  {m.anexo?.tipo === "pdf" && (
                    <a
                      href={m.anexo.url}
                      download={m.anexo.nome}
                      className="mb-1 flex items-center gap-2 rounded-lg bg-card/70 px-3 py-2 text-xs underline"
                    >
                      <Paperclip size={14} aria-hidden /> {m.anexo.nome}
                    </a>
                  )}
                  {m.audioSegundos ? <PlayerAudio segundos={m.audioSegundos} /> : null}

                  {m.texto && <p className="whitespace-pre-line">{m.texto}</p>}
                  <p className="mt-1 flex items-center justify-end text-[11px] opacity-70">
                    {m.hora}
                    {m.status && <StatusLeitura status={m.status} />}
                  </p>
                </div>

                {m.de === "bot" && m.texto && (
                  <button
                    onClick={() => setFixadas((f) => ({ ...f, [pet.id]: m.texto }))}
                    aria-label="Fixar esta mensagem no topo (ONG/Protetor)"
                    title="Fixar no topo"
                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary"
                  >
                    <Pin size={14} aria-hidden />
                  </button>
                )}
              </div>
            ))}
            <div ref={fim} />
          </div>

          {ultima?.opcoes && (
            <div className="flex flex-wrap gap-2 border-t border-border p-3">
              {ultima.opcoes.map((o) => (
                <button
                  key={o}
                  onClick={() => escolher(o)}
                  className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
                >
                  {o}
                </button>
              ))}
            </div>
          )}

          {!ultima?.opcoes && config.respostasRapidas.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-border p-3">
              {config.respostasRapidas.map((r) => (
                <button
                  key={r}
                  onClick={() => enviar(r)}
                  className="rounded-full border border-input bg-accent px-3 py-1 text-xs text-accent-foreground hover:bg-accent/70"
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar(texto);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              ref={arquivoRef}
              type="file"
              accept="image/*,video/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void anexarArquivo(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => arquivoRef.current?.click()}
              aria-label="Anexar foto, vídeo ou PDF"
              title="Anexar foto, vídeo ou PDF"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-input bg-card text-primary hover:bg-accent"
            >
              <Paperclip size={18} strokeWidth={1.5} aria-hidden />
            </button>

            {gravando ? (
              <div className="flex flex-1 items-center gap-3 rounded-full border border-primary/40 bg-accent px-4 py-2 text-sm text-accent-foreground">
                <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" aria-hidden />
                Gravando áudio · 0:{String(segundos).padStart(2, "0")}
                <button
                  type="button"
                  onClick={() => {
                    setGravando(false);
                    setSegundos(0);
                  }}
                  className="ml-auto text-xs underline"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  aria-label="Enviar áudio"
                  onClick={() => {
                    setGravando(false);
                    finalizarAudio(segundos || 1);
                    setSegundos(0);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Square size={13} aria-hidden />
                </button>
              </div>
            ) : (
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escreva sua mensagem..."
                className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            )}

            {!gravando && (
              <button
                type="button"
                onClick={() => {
                  setSegundos(0);
                  setGravando(true);
                }}
                aria-label="Gravar mensagem de áudio"
                title="Gravar áudio"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-input bg-card text-primary hover:bg-accent"
              >
                <Mic size={18} strokeWidth={1.5} aria-hidden />
              </button>
            )}

            <button
              type="submit"
              className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Enviar
            </button>
          </form>
        </section>
      </div>
    </SiteLayout>
  );
}

function PainelBot({
  config,
  onSalvar,
}: {
  config: ConfigBot;
  onSalvar: (c: ConfigBot) => void;
}) {
  const [rascunho, setRascunho] = useState<ConfigBot>(config);
  const [salvo, setSalvo] = useState(false);

  function atualizar(patch: Partial<ConfigBot>) {
    setRascunho((r) => ({ ...r, ...patch }));
    setSalvo(false);
  }

  return (
    <section className="surface-vintage mt-6 space-y-4 p-6">
      <h2 className="text-xl font-semibold text-foreground">
        Mensagens automáticas de triagem (ONG / Protetor)
      </h2>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={rascunho.ativo}
          onChange={(e) => atualizar({ ativo: e.target.checked })}
          className="h-4 w-4"
        />
        Ativar assistente virtual antes do atendimento humano
      </label>

      <label className="block text-sm text-foreground">
        Saudação (use <code>{"{pet}"}</code> para o nome do animal)
        <textarea
          value={rascunho.saudacao}
          onChange={(e) => atualizar({ saudacao: e.target.value })}
          rows={2}
          className="mt-2 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Perguntas de triagem</p>
          {rascunho.perguntas.map((p, i) => (
            <input
              key={i}
              value={p}
              onChange={(e) =>
                atualizar({
                  perguntas: rascunho.perguntas.map((q, j) => (j === i ? e.target.value : q)),
                })
              }
              className="mt-2 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          ))}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Respostas rápidas do adotante</p>
          {rascunho.respostasRapidas.map((p, i) => (
            <input
              key={i}
              value={p}
              onChange={(e) =>
                atualizar({
                  respostasRapidas: rascunho.respostasRapidas.map((q, j) =>
                    j === i ? e.target.value : q,
                  ),
                })
              }
              className="mt-2 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            salvarConfigBot(rascunho);
            onSalvar(rascunho);
            setSalvo(true);
          }}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Salvar configuração
        </button>
        {salvo && <span className="text-sm text-primary">Configuração salva!</span>}
      </div>
    </section>
  );
}
