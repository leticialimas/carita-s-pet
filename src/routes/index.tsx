import { createFileRoute } from "@tanstack/react-router";
import {
  Cat,
  Dog,
  Heart,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  PawPrint,
  Search,
  Share2,
  ShieldCheck,
  Stethoscope,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carita's Pets | Adoção responsável em Brasília - DF" },
      {
        name: "description",
        content:
          "Interface mobile-first da Carita's Pets para adoção de cães e gatos, vaquinhas e alertas de pets desaparecidos no DF.",
      },
      { property: "og:title", content: "Carita's Pets | Adoção responsável em Brasília - DF" },
      {
        property: "og:description",
        content:
          "Conheça pets para adoção, apoie vaquinhas e compartilhe alertas de animais desaparecidos em Brasília - DF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaritasPetsApp,
});

type View = "inicio" | "adocao" | "vaquinhas" | "desaparecidos";
type Pet = {
  id: string;
  nome: string;
  especie: "Cão" | "Gato";
  idade: string;
  regiao: string;
  foto: string;
  temperamento: string;
};

type Vaquinha = {
  id: string;
  titulo: string;
  foto: string;
  arrecadado: number;
  meta: number;
  categoria: string;
};

type Desaparecido = {
  id: string;
  nome: string;
  especie: string;
  local: string;
  foto: string;
  detalhe: string;
};

const pets: Pet[] = [
  {
    id: "mel",
    nome: "Mel",
    especie: "Cão",
    idade: "2 anos",
    regiao: "Asa Norte",
    foto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80",
    temperamento: "Dócil e calma",
  },
  {
    id: "tobias",
    nome: "Tobias",
    especie: "Cão",
    idade: "8 meses",
    regiao: "Cruzeiro",
    foto: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80",
    temperamento: "Brincalhão",
  },
  {
    id: "amora",
    nome: "Amora",
    especie: "Gato",
    idade: "1 ano",
    regiao: "Águas Claras",
    foto: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=900&q=80",
    temperamento: "Carinhosa",
  },
  {
    id: "nina",
    nome: "Nina",
    especie: "Gato",
    idade: "3 anos",
    regiao: "Sobradinho",
    foto: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=900&q=80",
    temperamento: "Independente",
  },
  {
    id: "caramelo",
    nome: "Caramelo",
    especie: "Cão",
    idade: "3 anos",
    regiao: "Gama",
    foto: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=900&q=80",
    temperamento: "Companheiro",
  },
  {
    id: "pipoca",
    nome: "Pipoca",
    especie: "Gato",
    idade: "4 meses",
    regiao: "Cruzeiro",
    foto: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900&q=80",
    temperamento: "Curiosa",
  },
];

const vaquinhas: Vaquinha[] = [
  {
    id: "luna",
    titulo: "Cirurgia ortopédica da Luna",
    foto: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80",
    arrecadado: 1850,
    meta: 3200,
    categoria: "Tratamento veterinário",
  },
  {
    id: "gatinhos",
    titulo: "Ração para 18 gatinhos resgatados",
    foto: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900&q=80",
    arrecadado: 740,
    meta: 1200,
    categoria: "Alimentação",
  },
  {
    id: "thor",
    titulo: "Carrinho de apoio para o Thor",
    foto: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=900&q=80",
    arrecadado: 960,
    meta: 1800,
    categoria: "Mobilidade",
  },
];

const desaparecidos: Desaparecido[] = [
  {
    id: "belinha",
    nome: "Belinha",
    especie: "Cadela",
    local: "Último local: Sudoeste - DF",
    foto: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80",
    detalhe: "Porte médio, coleira rosa, muito dócil.",
  },
  {
    id: "mingau",
    nome: "Mingau",
    especie: "Gato",
    local: "Último local: Lago Norte - DF",
    foto: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=900&q=80",
    detalhe: "Pelagem branca, olhos verdes, assustado com barulhos.",
  },
  {
    id: "dora",
    nome: "Dora",
    especie: "Cadela",
    local: "Último local: Taguatinga - DF",
    foto: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80",
    detalhe: "Filhote caramelo, mancha branca no peito.",
  },
];

const navItems = [
  { view: "inicio", label: "Início", Icone: Home },
  { view: "adocao", label: "Adoção", Icone: PawPrint },
  { view: "vaquinhas", label: "Vaquinhas", Icone: Heart },
  { view: "desaparecidos", label: "Desaparecidos", Icone: Search },
] as const;

const regioes = ["Todas", "Asa Norte", "Cruzeiro", "Águas Claras", "Sobradinho", "Gama"];
const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

function CaritasPetsApp() {
  const [view, setView] = useState<View>("adocao");
  const [menuAberto, setMenuAberto] = useState(false);
  const [loginAberto, setLoginAberto] = useState(false);
  const [petChat, setPetChat] = useState<Pet | null>(null);
  const [filtro, setFiltro] = useState("Todos");
  const [regiao, setRegiao] = useState("Todas");

  const petsFiltrados = useMemo(
    () =>
      pets.filter((pet) => {
        const porFiltro =
          filtro === "Todos" ||
          (filtro === "Filhotes" && pet.idade.includes("meses")) ||
          (filtro === "Gatos" && pet.especie === "Gato") ||
          (filtro === "Cães" && pet.especie === "Cão");
        const porRegiao = regiao === "Todas" || pet.regiao === regiao;
        return porFiltro && porRegiao;
      }),
    [filtro, regiao],
  );

  return (
    <div className="min-h-screen bg-background font-serif text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-primary/20 bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setView("inicio")}
            className="flex min-w-0 items-center gap-2 text-left text-primary"
            aria-label="Ir para o início"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <PawPrint size={22} strokeWidth={1.5} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-2xl font-bold leading-none">Carita&apos;s Pets</span>
              <span className="block truncate text-xs uppercase tracking-normal text-muted-foreground">
                Brasília - DF
              </span>
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-2">
            <Button size="sm" onClick={() => setLoginAberto(true)}>
              Entrar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu"
              className="text-primary"
            >
              <Menu size={22} strokeWidth={2} aria-hidden />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-24 pb-28 md:pb-12">
        <div className="hidden gap-2 pb-5 md:flex">
          {navItems.map(({ view: itemView, label, Icone }) => (
            <Button
              key={itemView}
              type="button"
              variant={view === itemView ? "default" : "outline"}
              onClick={() => setView(itemView)}
            >
              <Icone size={16} strokeWidth={1.5} aria-hidden />
              {label}
            </Button>
          ))}
        </div>

        {view === "inicio" && <InicioView irParaAdocao={() => setView("adocao")} />}
        {view === "adocao" && (
          <AdocaoView
            filtro={filtro}
            setFiltro={setFiltro}
            regiao={regiao}
            setRegiao={setRegiao}
            petsFiltrados={petsFiltrados}
            abrirChat={setPetChat}
          />
        )}
        {view === "vaquinhas" && <VaquinhasView />}
        {view === "desaparecidos" && <DesaparecidosView />}
      </main>

      <MobileNav view={view} setView={setView} />
      <Footer />

      {menuAberto && <MenuLateral fechar={() => setMenuAberto(false)} abrirLogin={() => setLoginAberto(true)} />}
      {loginAberto && <LoginModal fechar={() => setLoginAberto(false)} />}
      {petChat && <ChatModal pet={petChat} fechar={() => setPetChat(null)} />}
    </div>
  );
}

function InicioView({ irParaAdocao }: { irParaAdocao: () => void }) {
  return (
    <section className="grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-center">
      <div className="surface-vintage p-6 md:p-8">
        <p className="text-xs uppercase tracking-normal text-primary">Adoção responsável no DF</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground md:text-5xl">
          Encontre um novo amigo com segurança e carinho.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          A Carita&apos;s Pets conecta adotantes, ONGs e protetores independentes em uma experiência
          digital acolhedora para cães e gatos de Brasília.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={irParaAdocao}>Ver pets para adoção</Button>
          <Button variant="secondary">Conhecer vaquinhas</Button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-card shadow-md">
        <img
          src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1000&q=80"
          alt="Pessoa acariciando um cão adotado"
          className="h-80 w-full object-cover"
        />
        <div className="absolute right-4 bottom-4 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow">
          100% digital e independente
        </div>
      </div>
    </section>
  );
}

function AdocaoView({
  filtro,
  setFiltro,
  regiao,
  setRegiao,
  petsFiltrados,
  abrirChat,
}: {
  filtro: string;
  setFiltro: (value: string) => void;
  regiao: string;
  setRegiao: (value: string) => void;
  petsFiltrados: Pet[];
  abrirChat: (pet: Pet) => void;
}) {
  return (
    <section>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Catálogo de adoção</p>
          <h1 className="text-3xl font-bold text-foreground">Pets disponíveis</h1>
        </div>
        <div className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
          {petsFiltrados.length} pets encontrados
        </div>
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto rounded-lg bg-accent p-3 shadow-sm">
        {["Todos", "Filhotes", "Gatos", "Cães"].map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={filtro === item ? "default" : "secondary"}
            onClick={() => setFiltro(item)}
            className="shrink-0"
          >
            {item === "Gatos" && <Cat size={15} strokeWidth={1.5} aria-hidden />}
            {item === "Cães" && <Dog size={15} strokeWidth={1.5} aria-hidden />}
            {item}
          </Button>
        ))}
        <label className="flex shrink-0 items-center gap-2 rounded-md border border-primary/20 bg-card px-3 text-sm text-primary">
          Região do DF
          <select
            value={regiao}
            onChange={(event) => setRegiao(event.target.value)}
            className="bg-card py-2 text-foreground outline-none"
          >
            {regioes.map((item) => (
              <option key={item} value={item}>
                {item === "Todas" ? "Todas" : item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {petsFiltrados.map((pet) => (
          <article key={pet.id} className="surface-vintage relative overflow-hidden">
            <img src={pet.foto} alt={`${pet.nome}, ${pet.especie} para adoção`} className="h-56 w-full object-cover" />
            <button
              type="button"
              aria-label={`Favoritar ${pet.nome}`}
              className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground shadow"
            >
              <Heart size={20} strokeWidth={1.6} aria-hidden />
            </button>
            <div className="space-y-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-bold text-foreground">{pet.nome}</h2>
                  <p className="text-sm text-muted-foreground">
                    {pet.idade} · {pet.especie} · {pet.regiao}
                  </p>
                </div>
                <span className="h-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {pet.temperamento}
                </span>
              </div>
              <Button type="button" variant="secondary" className="w-full shadow-md" onClick={() => abrirChat(pet)}>
                Tenho Interesse
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function VaquinhasView() {
  return (
    <section>
      <p className="text-sm font-semibold text-primary">Vaquinha dos Pets</p>
      <h1 className="text-3xl font-bold text-foreground">Apoie tratamentos e resgates</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {vaquinhas.map((campanha) => {
          const porcentagem = Math.round((campanha.arrecadado / campanha.meta) * 100);
          return (
            <article key={campanha.id} className="surface-vintage overflow-hidden">
              <img src={campanha.foto} alt={campanha.titulo} className="h-52 w-full object-cover" />
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-normal text-primary">{campanha.categoria}</p>
                  <h2 className="mt-1 text-xl font-bold text-foreground">{campanha.titulo}</h2>
                </div>
                <Progress value={porcentagem} />
                <p className="text-sm text-muted-foreground">
                  {formatarMoeda(campanha.arrecadado)} arrecadados de {formatarMoeda(campanha.meta)}
                </p>
                <Button className="w-full">Doar via PIX</Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DesaparecidosView() {
  return (
    <section>
      <p className="text-sm font-semibold text-primary">Alerta Pet DF</p>
      <h1 className="text-3xl font-bold text-foreground">Animais desaparecidos</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {desaparecidos.map((pet) => (
          <article key={pet.id} className="relative overflow-hidden rounded-lg border-2 border-dashed border-destructive bg-card shadow-md">
            <div className="absolute top-4 -right-12 z-10 rotate-45 bg-accent px-12 py-1 text-xs font-bold text-accent-foreground shadow">
              PROCURA-SE
            </div>
            <img src={pet.foto} alt={`${pet.nome}, ${pet.especie} desaparecido`} className="h-60 w-full object-cover" />
            <div className="space-y-3 p-5">
              <div>
                <h2 className="text-2xl font-bold text-primary">{pet.nome}</h2>
                <p className="text-sm text-muted-foreground">{pet.especie} · {pet.detalhe}</p>
              </div>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin size={16} strokeWidth={1.5} aria-hidden />
                {pet.local}
              </p>
              <Button variant="secondary" className="w-full">
                <Share2 size={16} strokeWidth={1.5} aria-hidden />
                Compartilhar
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MobileNav({ view, setView }: { view: View; setView: (view: View) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/20 bg-card/95 backdrop-blur md:hidden">
      <ul className="grid grid-cols-4">
        {navItems.map(({ view: itemView, label, Icone }) => (
          <li key={itemView}>
            <button
              type="button"
              onClick={() => setView(itemView)}
              className={`flex w-full flex-col items-center gap-1 px-1 py-2 text-[11px] ${
                view === itemView ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icone size={22} strokeWidth={1.4} aria-hidden />
              <span className="truncate">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MenuLateral({ fechar, abrirLogin }: { fechar: () => void; abrirLogin: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Fechar menu" onClick={fechar} className="absolute inset-0 bg-foreground/30" />
      <aside className="absolute top-0 right-0 h-full w-72 max-w-[86vw] border-l border-primary/30 bg-secondary shadow-2xl">
        <div className="flex items-center justify-between border-b border-primary/20 p-5">
          <p className="text-xl font-bold text-primary">Menu</p>
          <Button type="button" variant="ghost" size="icon" onClick={fechar} aria-label="Fechar menu">
            <X size={20} strokeWidth={1.5} aria-hidden />
          </Button>
        </div>
        <div className="divide-y divide-primary/20">
          {[
            "Meu Perfil",
            "Meus Chats",
            "Sair",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                if (item === "Meu Perfil") abrirLogin();
                fechar();
              }}
              className="block w-full px-5 py-4 text-left text-base font-semibold text-secondary-foreground hover:bg-white/40"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="m-5 rounded-md border border-primary/20 bg-card/75 p-4 text-sm text-muted-foreground">
          <ShieldCheck className="mb-2 text-primary" size={22} strokeWidth={1.5} aria-hidden />
          ONGs e protetores verificados antes de conversar com adotantes.
        </div>
      </aside>
    </div>
  );
}

function LoginModal({ fechar }: { fechar: () => void }) {
  return (
    <ModalShell titulo="Entrar ou cadastrar" fechar={fechar}>
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          E-mail
          <input className="mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" type="email" placeholder="voce@email.com" />
        </label>
        <label className="block text-sm font-semibold text-foreground">
          Senha
          <input className="mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" type="password" placeholder="Sua senha" />
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-primary/40 bg-accent/70 p-4 text-sm font-semibold text-accent-foreground">
          <Upload size={18} strokeWidth={1.5} aria-hidden />
          Upload do comprovante de residência
          <input type="file" className="sr-only" />
        </label>
        <Button className="w-full" onClick={fechar}>Entrar</Button>
      </div>
    </ModalShell>
  );
}

function ChatModal({ pet, fechar }: { pet: Pet; fechar: () => void }) {
  const [resposta, setResposta] = useState("");
  const [mensagens, setMensagens] = useState([
    "Olá! Responda 3 perguntinhas rápidas: Você mora em casa ou apartamento?",
  ]);

  function enviar() {
    if (!resposta.trim()) return;
    setMensagens((lista) => [...lista, resposta.trim(), "Obrigada! Você tem telas de proteção e tempo diário para adaptação?"]);
    setResposta("");
  }

  return (
    <ModalShell titulo={`Conversa sobre ${pet.nome}`} fechar={fechar}>
      <div className="overflow-hidden rounded-lg border border-primary/20 bg-muted">
        <div className="flex items-center gap-3 border-b border-primary/20 bg-accent p-3">
          <img src={pet.foto} alt={pet.nome} className="h-11 w-11 rounded-full object-cover" />
          <div>
            <p className="font-bold text-primary">Bot da ONG Patinhas do Cerrado</p>
            <p className="text-xs text-muted-foreground">Triagem rápida pelo WhatsApp</p>
          </div>
        </div>
        <div className="max-h-80 space-y-3 overflow-y-auto p-4">
          {mensagens.map((mensagem, index) => {
            const usuario = index % 2 === 1;
            return (
              <div key={`${mensagem}-${index}`} className={`flex ${usuario ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] rounded-lg px-4 py-2 text-sm shadow-sm ${
                    usuario ? "bg-secondary text-secondary-foreground" : "bg-card text-foreground"
                  }`}
                >
                  {mensagem}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 border-t border-primary/20 bg-card p-3">
          <input
            value={resposta}
            onChange={(event) => setResposta(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && enviar()}
            className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Digite sua resposta..."
          />
          <Button onClick={enviar}>
            <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
            Enviar
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({ titulo, fechar, children }: { titulo: string; fechar: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/35 p-4">
      <section className="w-full max-w-lg rounded-lg border border-primary/20 bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-xl font-bold text-primary">{titulo}</h2>
          <Button type="button" variant="ghost" size="icon" onClick={fechar} aria-label="Fechar modal">
            <X size={20} strokeWidth={1.5} aria-hidden />
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-primary px-4 py-8 pb-24 text-primary-foreground md:pb-8">
      <div className="mx-auto max-w-6xl space-y-2 text-sm">
        <p>Brasília - DF | Somos uma plataforma 100% digital e independente, não possuímos sede física.</p>
        <p>
          Desenvolvido por: Letícia da Silva Lima, Letícia Krixi de Souza, Maíra Gomes Rodrigues,
          Sophia Abarno Lemos e Vitória Santana Barbosa.
        </p>
      </div>
    </footer>
  );
}