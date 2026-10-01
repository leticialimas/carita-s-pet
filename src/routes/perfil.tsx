import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import {
  arquivoParaDataUrl,
  lerAdotante,
  salvarAdotante,
  type Adotante,
  type PetAtual,
} from "@/lib/adotante";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu currículo de adoção | Carita's Pets" },
      {
        name: "description",
        content:
          "Monte seu currículo de adoção: foto, biografia da família, galeria do lar e informações dos pets que você já tem.",
      },
      { property: "og:title", content: "Meu currículo de adoção | Carita's Pets" },
      {
        property: "og:description",
        content: "Perfil do adotante visível apenas para a ONG ou protetor durante a conversa.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Perfil,
});

const input =
  "mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

function Perfil() {
  const [adotante, setAdotante] = useState<Adotante | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setAdotante(lerAdotante());
    setCarregado(true);
  }, []);

  if (!carregado) return <SiteLayout>{null}</SiteLayout>;

  if (!adotante) {
    return (
      <SiteLayout>
        <div className="surface-vintage mx-auto max-w-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Perfil de adotante</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Faça o cadastro de Adotante para montar seu currículo de adoção.
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

  const perfil = adotante;

  function atualizar(patch: Partial<Adotante>) {
    setAdotante({ ...perfil, ...patch });
    setSalvo(false);
  }

  async function trocarFoto(file: File | undefined) {
    if (!file) return;
    atualizar({ fotoPerfil: await arquivoParaDataUrl(file) });
  }

  async function adicionarGaleria(files: FileList | null) {
    if (!files?.length) return;
    const atuais = perfil.galeriaLar ?? [];
    const espaco = Math.max(0, 5 - atuais.length);
    const novas = await Promise.all(
      Array.from(files).slice(0, espaco).map(arquivoParaDataUrl),
    );
    atualizar({ galeriaLar: [...atuais, ...novas] });
  }

  function salvar() {
    try {
      salvarAdotante(perfil);
      setErro("");
      setSalvo(true);
    } catch {
      setErro(
        "Não conseguimos salvar: as fotos são grandes demais para a memória do navegador. Remova alguma imagem e tente novamente.",
      );
    }
  }

  const petsAtuais = perfil.petsAtuais ?? [];

  return (
    <SiteLayout>
      <h1 className="text-3xl font-bold text-foreground">Meu currículo de adoção</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Este perfil não é público na internet. Ele só é exibido para a ONG ou protetor no momento em
        que você inicia uma conversa sobre um pet.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="surface-vintage space-y-4 p-6">
          <div className="flex items-center gap-4">
            {perfil.fotoPerfil ? (
              <img
                src={perfil.fotoPerfil}
                alt="Foto de perfil"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {perfil.nome.charAt(0).toUpperCase() || "A"}
              </span>
            )}
            <div>
              <p className="font-semibold text-foreground">{perfil.nome}</p>
              <p className="text-xs text-muted-foreground">{perfil.cidade}</p>
            </div>
          </div>
          <label className="block text-sm text-foreground">
            Foto de perfil (pessoal ou da família)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => void trocarFoto(e.target.files?.[0])}
              className={input}
            />
          </label>
          <label className="block text-sm text-foreground">
            Sobre mim / minha família
            <textarea
              rows={6}
              value={perfil.bio ?? ""}
              onChange={(e) => atualizar({ bio: e.target.value })}
              placeholder="Ex.: Somos um casal que trabalha em home office, amamos gatos e temos muito tempo para brincar."
              className={input}
            />
          </label>
        </section>

        <div className="space-y-6">
          <section className="surface-vintage space-y-4 p-6">
            <h2 className="text-xl font-semibold text-foreground">Galeria do lar (até 5 fotos)</h2>
            <p className="text-sm text-muted-foreground">
              Mostre as telas de proteção, o quintal e o espaço onde o pet vai dormir.
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={(perfil.galeriaLar?.length ?? 0) >= 5}
              onChange={(e) => void adicionarGaleria(e.target.files)}
              className={input}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(perfil.galeriaLar ?? []).map((f, i) => (
                <figure key={i} className="relative overflow-hidden rounded-lg border border-border">
                  <img src={f} alt={`Foto ${i + 1} do lar`} className="h-28 w-full object-cover" />
                  <button
                    onClick={() =>
                      atualizar({
                        galeriaLar: (perfil.galeriaLar ?? []).filter((_, j) => j !== i),
                      })
                    }
                    className="absolute top-1 right-1 rounded-full bg-card px-2 text-sm text-foreground shadow"
                    aria-label={`Remover foto ${i + 1}`}
                  >
                    ×
                  </button>
                </figure>
              ))}
            </div>
          </section>

          <section className="surface-vintage space-y-4 p-6">
            <h2 className="text-xl font-semibold text-foreground">Meus pets atuais</h2>
            {petsAtuais.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum pet cadastrado ainda. Se você já tem animais, adicione-os abaixo.
              </p>
            )}
            <div className="space-y-4">
              {petsAtuais.map((p, i) => (
                <div key={p.id} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-[96px_1fr]">
                  {p.foto ? (
                    <img src={p.foto} alt={p.nome} className="h-24 w-24 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-md bg-accent text-3xl">
                      🐾
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={p.nome}
                        placeholder="Nome"
                        onChange={(e) =>
                          atualizar({
                            petsAtuais: petsAtuais.map((q, j) =>
                              j === i ? { ...q, nome: e.target.value } : q,
                            ),
                          })
                        }
                        className={input}
                      />
                      <input
                        value={p.especie}
                        placeholder="Espécie / raça"
                        onChange={(e) =>
                          atualizar({
                            petsAtuais: petsAtuais.map((q, j) =>
                              j === i ? { ...q, especie: e.target.value } : q,
                            ),
                          })
                        }
                        className={input}
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const foto = await arquivoParaDataUrl(f);
                        atualizar({
                          petsAtuais: petsAtuais.map((q, j) => (j === i ? { ...q, foto } : q)),
                        });
                      }}
                      className={input}
                    />
                    <div className="flex flex-wrap gap-4 text-sm text-foreground">
                      {(
                        [
                          ["sociavel", "Sociável"],
                          ["vacinado", "Vacinado"],
                          ["castrado", "Castrado"],
                        ] as const
                      ).map(([campo, label]) => (
                        <label key={campo} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={p[campo]}
                            onChange={(e) =>
                              atualizar({
                                petsAtuais: petsAtuais.map((q, j) =>
                                  j === i ? { ...q, [campo]: e.target.checked } : q,
                                ),
                              })
                            }
                            className="h-4 w-4"
                          />
                          {label}
                        </label>
                      ))}
                      <button
                        onClick={() =>
                          atualizar({ petsAtuais: petsAtuais.filter((_, j) => j !== i) })
                        }
                        className="ml-auto text-sm text-destructive underline underline-offset-4"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                atualizar({
                  petsAtuais: [
                    ...petsAtuais,
                    {
                      id: String(Date.now()),
                      nome: "",
                      especie: "",
                      foto: "",
                      sociavel: true,
                      vacinado: true,
                      castrado: false,
                    } satisfies PetAtual,
                  ],
                })
              }
              className="rounded-md border border-input bg-accent px-4 py-2 text-sm text-accent-foreground hover:bg-accent/70"
            >
              + Adicionar pet
            </button>
          </section>

          {erro && (
            <p className="rounded-md border border-destructive bg-card p-3 text-sm text-destructive">
              {erro}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={salvar}
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Salvar perfil
            </button>
            {salvo && <span className="text-sm text-primary">Perfil atualizado!</span>}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
