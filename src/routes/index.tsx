import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Cat, Dog, Heart, Home, MessageCircle, Paperclip, PawPrint, Search,
  ShieldCheck, Headphones, Settings, Send, X, Copy, Plus, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carita's Pets | Adoção responsável no DF" },
      { name: "description", content: "Adoção responsável de cães e gatos em Brasília - DF." },
    ],
  }),
  component: CaritasPetsApp,
});

type View = "inicio" | "pets" | "vaquinhas" | "suporte" | "admin";
type Role = "adotante" | "ong" | "protetor";
type Pet = { id:string; nome:string; especie:"Cão"|"Gato"; idade:string; regiao:string; foto:string; temperamento:string; doador:string };
type Campaign = { id:string; titulo:string; foto:string; arrecadado:number; meta:number; pix:string; petId?:string };
type Message = { id:string; sender:"eu"|"protetor"; text?:string; attachment?:string; time:string };

const initialPets:Pet[] = [
 {id:"mel",nome:"Mel",especie:"Cão",idade:"2 anos",regiao:"Asa Norte",foto:"https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80",temperamento:"Dócil",doador:"Patinhas do Cerrado"},
 {id:"tobias",nome:"Tobias",especie:"Cão",idade:"8 meses",regiao:"Cruzeiro",foto:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80",temperamento:"Brincalhão",doador:"Ana Protetora"},
 {id:"amora",nome:"Amora",especie:"Gato",idade:"1 ano",regiao:"Águas Claras",foto:"https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=900&q=80",temperamento:"Carinhosa",doador:"ONG Bigodes do DF"},
 {id:"nina",nome:"Nina",especie:"Gato",idade:"3 anos",regiao:"Sobradinho",foto:"https://images.unsplash.com/photo-1574158622682-e40e69881006?w=900&q=80",temperamento:"Tranquila",doador:"Patinhas do Cerrado"},
];

const initialCampaigns:Campaign[] = [
 {id:"luna",titulo:"Cirurgia ortopédica da Luna",foto:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80",arrecadado:1850,meta:3200,pix:"caritaspets@pix.example",petId:"mel"},
 {id:"gatinhos",titulo:"Ração para gatinhos resgatados",foto:"https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900&q=80",arrecadado:740,meta:1200,pix:"32987654000190",},
];

const initialMessages:Record<string,Message[]> = {
 mel:[
  {id:"1",sender:"protetor",text:"Olá! A Mel está disponível para adoção. Quer conversar sobre a rotina dela?",time:"18:40"},
  {id:"2",sender:"eu",text:"Sim! Moro em apartamento e queria saber como ela se adapta.",time:"18:42"},
  {id:"3",sender:"protetor",text:"Ela é tranquila e já está acostumada com passeios.",time:"18:43"},
 ],
};

const brl=(v:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
const onlyDigits=(v:string)=>v.replace(/\D/g,"");
const maskCPF=(v:string)=>onlyDigits(v).slice(0,11).replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2");
const validCPF=(value:string)=>{
 const cpf=onlyDigits(value); if(cpf.length!==11||/^([0-9])\1+$/.test(cpf)) return false;
 let sum=0; for(let i=0;i<9;i++) sum+=+cpf[i]*(10-i); let d=(sum*10)%11;if(d===10)d=0;if(d!==+cpf[9])return false;
 sum=0;for(let i=0;i<10;i++)sum+=+cpf[i]*(11-i);d=(sum*10)%11;if(d===10)d=0;return d===+cpf[10];
};
const validCEP=(value:string)=>/^7[0-2]\d{3}-?\d{3}$/.test(value.trim());

function CaritasPetsApp(){
 const [view,setView]=useState<View>("inicio");
 const [auth,setAuth]=useState(false);
 const [chatPet,setChatPet]=useState<Pet|null>(null);
 const [support,setSupport]=useState(false);
 const [admin,setAdmin]=useState(false);
 const [pets,setPets]=useState<Pet[]>(()=>JSON.parse(localStorage.getItem("caritas-pets")||"null")||initialPets);
 const [campaigns,setCampaigns]=useState<Campaign[]>(()=>JSON.parse(localStorage.getItem("caritas-campaigns")||"null")||initialCampaigns);
 const [messages,setMessages]=useState<Record<string,Message[]>>(()=>JSON.parse(localStorage.getItem("caritas-messages")||"null")||initialMessages);
 const [profile,setProfile]=useState<any>(()=>JSON.parse(localStorage.getItem("caritas-profile")||"null"));
 useEffect(()=>localStorage.setItem("caritas-pets",JSON.stringify(pets)),[pets]);
 useEffect(()=>localStorage.setItem("caritas-campaigns",JSON.stringify(campaigns)),[campaigns]);
 useEffect(()=>localStorage.setItem("caritas-messages",JSON.stringify(messages)),[messages]);
 useEffect(()=>{if(profile)localStorage.setItem("caritas-profile",JSON.stringify(profile));},[profile]);

 const nav=[
  ["inicio","Início",Home],["pets","Adoção",PawPrint],["vaquinhas","Vaquinhas",Heart],["suporte","Suporte",Headphones]
 ] as const;

 return <div className="min-h-screen text-foreground font-serif">
  <header className="sticky top-0 z-40 border-b border-primary/20 bg-white/95 backdrop-blur">
   <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
    <button onClick={()=>setView("inicio")} className="flex items-center gap-2 text-primary">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary"><PawPrint size={22}/></span>
      <span><b className="block text-2xl">Carita's Pets</b><small>Brasília - DF</small></span>
    </button>
    <div className="flex items-center gap-2">
      {profile && <Button variant="outline" size="sm" onClick={()=>setView("admin")}><Settings size={16}/> Meu perfil</Button>}
      <Button onClick={()=>setAuth(true)} className="bg-primary hover:bg-primary/90">{profile?"Meu cadastro":"Entrar / Cadastrar"}</Button>
    </div>
   </div>
  </header>

  <main className="mx-auto max-w-6xl px-4 py-7 pb-28">
   {view==="inicio" && <HomeView goPets={()=>setView("pets")} />}
   {view==="pets" && <PetsView pets={pets} openChat={setChatPet}/>}
   {view==="vaquinhas" && <CampaignView campaigns={campaigns}/>}
   {view==="suporte" && <SupportView/>}
   {view==="admin" && <AdminView pets={pets} setPets={setPets} campaigns={campaigns} setCampaigns={setCampaigns} messages={messages}/>}
  </main>

  <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-primary/20 bg-white/95 backdrop-blur">
   <div className="mx-auto grid max-w-6xl grid-cols-4">
    {nav.map(([key,label,Icon])=><button key={key} onClick={()=>setView(key)} className={`flex flex-col items-center gap-1 py-2 text-xs ${view===key?"text-primary font-bold":"text-muted-foreground"}`}><Icon size={21}/>{label}</button>)}
   </div>
  </nav>

  {auth && <AuthModal close={()=>setAuth(false)} onSaved={(p:any)=>{setProfile(p);setAuth(false)}}/>}
  {chatPet && <ChatModal pet={chatPet} messages={messages[chatPet.id]||[]} setMessages={setMessages} close={()=>setChatPet(null)}/>}
  {support && <SupportModal close={()=>setSupport(false)}/>}
  <button onClick={()=>setSupport(true)} className="fixed right-4 bottom-20 z-30 rounded-full bg-secondary p-3 text-secondary-foreground shadow-lg md:bottom-5" aria-label="Suporte"><Headphones/></button>
 </div>;
}

function HomeView({goPets}:{goPets:()=>void}){
 return <div className="space-y-10">
  <section className="grid gap-6 overflow-hidden rounded-2xl border border-primary/20 bg-white/90 p-7 shadow md:grid-cols-2 md:items-center md:p-10">
   <div><p className="font-bold text-primary">ADOÇÃO RESPONSÁVEL NO DF</p><h1 className="mt-2 text-4xl font-bold md:text-5xl">Encontre seu novo melhor amigo no DF</h1><p className="mt-4 text-lg text-muted-foreground">Conectamos adotantes, ONGs e protetores independentes em uma plataforma 100% digital.</p><Button onClick={goPets} className="mt-6 bg-primary">Ver Pets Disponíveis</Button></div>
   <img className="h-80 w-full rounded-xl object-cover" src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1000&q=80" alt="Pessoa com cachorro"/>
  </section>
  <section><h2 className="text-3xl font-bold text-primary">Como funciona?</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{[["1","Busque","Encontre cães e gatos disponíveis."],["2","Conecte-se","Converse com quem cuida do pet."],["3","Adote","Complete seu cadastro e faça a adoção responsável."]].map(([n,t,d])=><article className="surface-vintage p-5" key={n}><span className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-bold">{n}</span><h3 className="mt-3 text-xl font-bold">{t}</h3><p className="text-muted-foreground">{d}</p></article>)}</div></section>
  <section><h2 className="text-3xl font-bold text-primary">Dicas de posse responsável</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{["Importância das telas de proteção","Adaptação do pet ao novo lar","Vacinas e acompanhamento veterinário"].map(t=><article className="rounded-xl bg-accent p-5" key={t}><ShieldCheck className="text-primary"/><h3 className="mt-3 font-bold">{t}</h3><p className="mt-1 text-sm">Informação e planejamento ajudam a criar um lar seguro.</p></article>)}</div></section>
  <section className="grid gap-4 md:grid-cols-2"><div className="rounded-xl bg-primary p-6 text-primary-foreground"><b className="text-3xl">+500</b><p>Pets adotados</p></div><div className="rounded-xl bg-secondary p-6"><b className="text-3xl text-primary">20</b><p>ONGs e protetores parceiros</p></div></section>
 </div>;
}

function PetsView({pets,openChat}:{pets:Pet[];openChat:(p:Pet)=>void}){
 const [filter,setFilter]=useState("Todos");
 const filtered=useMemo(()=>pets.filter(p=>filter==="Todos"||p.especie===filter),[pets,filter]);
 return <section><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-primary font-bold">CATÁLOGO</p><h1 className="text-3xl font-bold">Pets disponíveis</h1></div><div className="flex gap-2"><Button variant={filter==="Todos"?"default":"secondary"} onClick={()=>setFilter("Todos")}>Todos</Button><Button variant={filter==="Cão"?"default":"secondary"} onClick={()=>setFilter("Cão")}><Dog size={16}/>Cães</Button><Button variant={filter==="Gato"?"default":"secondary"} onClick={()=>setFilter("Gato")}><Cat size={16}/>Gatos</Button></div></div>
 <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(p=><article className="surface-vintage overflow-hidden" key={p.id}><img src={p.foto} alt={p.nome} className="h-56 w-full object-cover"/><div className="p-5"><h2 className="text-2xl font-bold">{p.nome}</h2><p className="text-muted-foreground">{p.idade} · {p.especie} · {p.regiao}</p><p className="mt-1 text-sm">Doador: {p.doador}</p><Button className="mt-4 w-full" onClick={()=>openChat(p)}><MessageCircle size={16}/> Tenho Interesse / Conversar</Button></div></article>)}</div></section>;
}

function CampaignView({campaigns}:{campaigns:Campaign[]}){
 const copy=(pix:string)=>navigator.clipboard?.writeText(pix);
 return <section><p className="font-bold text-primary">VAQUINHAS</p><h1 className="text-3xl font-bold">Ajude um pet</h1><div className="mt-6 grid gap-5 md:grid-cols-2">{campaigns.map(c=>{const pct=Math.min(100,Math.round(c.arrecadado/c.meta*100));return <article className="surface-vintage overflow-hidden" key={c.id}><img src={c.foto} alt={c.titulo} className="h-52 w-full object-cover"/><div className="p-5"><h2 className="text-xl font-bold">{c.titulo}</h2><Progress value={pct} className="my-4"/><p>{brl(c.arrecadado)} de {brl(c.meta)} · {pct}%</p><div className="mt-4 flex gap-2"><Button onClick={()=>copy(c.pix)} className="flex-1"><Copy size={16}/> Copiar PIX</Button><Button variant="secondary" onClick={()=>alert(`Chave PIX: ${c.pix}`)}>Doar via PIX</Button></div></div></article>})}</div></section>;
}

function AuthModal({close,onSaved}:{close:()=>void;onSaved:(p:any)=>void}){
 const [tab,setTab]=useState<"entrar"|"cadastrar">("entrar"); const [role,setRole]=useState<Role|null>(null);
 const [nome,setNome]=useState("");const [email,setEmail]=useState("");const [senha,setSenha]=useState("");const [whats,setWhats]=useState("");const [cep,setCep]=useState("");const [cpf,setCpf]=useState("");const [comprovante,setComprovante]=useState("");const [censo,setCenso]=useState({moradia:"",outrosPets:"",tempo:"",telas:""});
 const [error,setError]=useState("");
 function save(){setError("");if(!nome||!email||!senha)return setError("Preencha nome, e-mail e senha.");if(role==="adotante"&&( !validCEP(cep)||!validCPF(cpf)||!comprovante))return setError("Informe CEP válido do DF/entorno, CPF válido e comprovante.");const p={nome,email,whats,cep,cpf,comprovante,role,censo,perfilCompleto:true,createdAt:new Date().toISOString()};onSaved(p);}
 return <Modal title="Entrar / Cadastrar" close={close}><div className="flex gap-2 border-b pb-3"><Button variant={tab==="entrar"?"default":"secondary"} onClick={()=>setTab("entrar")}>Entrar</Button><Button variant={tab==="cadastrar"?"default":"secondary"} onClick={()=>setTab("cadastrar")}>Cadastrar</Button></div>
 {tab==="entrar"?<div className="space-y-4 pt-4"><Field label="E-mail"><input className="input-vintage" type="email" value={email} onChange={e=>setEmail(e.target.value)}/></Field><Field label="Senha"><input className="input-vintage" type="password" value={senha} onChange={e=>setSenha(e.target.value)}/></Field><button className="text-sm text-primary underline">Esqueci minha senha</button><Button className="w-full" onClick={()=>onSaved({nome:email.split("@")[0]||"Adotante",email,perfilCompleto:false})}>Entrar</Button></div>
 :<div className="pt-4 space-y-4">{!role?<><p className="font-bold">Escolha seu perfil</p>{([["adotante","Sou Adotante"],["ong","Sou uma ONG"],["protetor","Sou Protetor Independente"]] as const).map(([r,t])=><button key={r} onClick={()=>setRole(r)} className="w-full rounded-xl border-2 border-primary/20 bg-secondary p-5 text-left font-bold hover:border-primary">{t}</button>)}</>:<><p className="text-sm text-primary font-bold">Cadastro: {role}</p><Field label="Nome"><input className="input-vintage" value={nome} onChange={e=>setNome(e.target.value)}/></Field><Field label="E-mail"><input className="input-vintage" type="email" value={email} onChange={e=>setEmail(e.target.value)}/></Field><Field label="Senha"><input className="input-vintage" type="password" value={senha} onChange={e=>setSenha(e.target.value)}/></Field><Field label="WhatsApp"><input className="input-vintage" value={whats} onChange={e=>setWhats(e.target.value)}/></Field>{role==="adotante"&&<><Field label="CPF"><input className="input-vintage" value={cpf} onChange={e=>setCpf(maskCPF(e.target.value))} placeholder="000.000.000-00"/></Field><Field label="CEP (apenas DF e entorno)"><input className="input-vintage" value={cep} onChange={e=>setCep(e.target.value)} placeholder="70000-000"/></Field><Field label="Comprovante de residência"><input className="input-vintage" type="file" accept=".pdf,image/*" onChange={e=>setComprovante(e.target.files?.[0]?.name||"")}/></Field><div className="rounded-xl bg-accent p-4"><b>Censo do adotante</b><div className="mt-3 grid gap-2"><select className="input-vintage" value={censo.moradia} onChange={e=>setCenso({...censo,moradia:e.target.value})}><option value="">Tipo de moradia</option><option>Casa</option><option>Apartamento</option></select><input className="input-vintage" placeholder="Já possui outros pets?" value={censo.outrosPets} onChange={e=>setCenso({...censo,outrosPets:e.target.value})}/><input className="input-vintage" placeholder="Tempo diário disponível" value={censo.tempo} onChange={e=>setCenso({...censo,tempo:e.target.value})}/><input className="input-vintage" placeholder="Possui telas de proteção?" value={censo.telas} onChange={e=>setCenso({...censo,telas:e.target.value})}/></div></div></>}{role!=="adotante"&&<Field label={role==="ong"?"CNPJ":"CPF"}><input className="input-vintage"/></Field>}{error&&<p className="rounded bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<div className="flex gap-2"><Button variant="secondary" onClick={()=>setRole(null)}>Voltar</Button><Button onClick={save} className="flex-1">Salvar cadastro</Button></div></>}</div>}</Modal>;
}

function ChatModal({pet,messages,setMessages,close}:{pet:Pet;messages:Message[];setMessages:React.Dispatch<React.SetStateAction<Record<string,Message[]>>>;close:()=>void}){
 const [text,setText]=useState("");const [file,setFile]=useState("");
 const send=(attachment?:string)=>{if(!text.trim()&&!attachment)return;const m={id:crypto.randomUUID(),sender:"eu" as const,text:text.trim()||undefined,attachment,time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})};setMessages(prev=>({...prev,[pet.id]:[...(prev[pet.id]||[]),m]}));setText("");setFile("");};
 return <Modal title={`Chat · ${pet.nome}`} close={close}><div className="rounded-xl border bg-muted"><div className="flex items-center gap-3 border-b bg-accent p-3"><img src={pet.foto} alt={pet.nome} className="h-11 w-11 rounded-full object-cover"/><div><b>{pet.doador}</b><p className="text-xs">Conversa sobre adoção</p></div></div><div className="max-h-80 space-y-3 overflow-y-auto p-4">{messages.map(m=><div key={m.id} className={`flex ${m.sender==="eu"?"justify-end":"justify-start"}`}><div className={`max-w-[80%] rounded-xl p-3 text-sm ${m.sender==="eu"?"bg-secondary":"bg-white"}`}>{m.text&&<p>{m.text}</p>}{m.attachment&&<p className="mt-1 text-xs font-semibold">📎 {m.attachment}</p>}<small className="block mt-1 opacity-60">{m.time}</small></div></div>)}</div><div className="flex items-center gap-2 border-t bg-white p-3"><label className="cursor-pointer"><Paperclip/><input type="file" accept="image/*,audio/*" className="sr-only" onChange={e=>{const f=e.target.files?.[0];if(f){setFile(f.name);send(f.name)}}}/></label><input className="input-vintage flex-1" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escreva uma mensagem..."/><Button size="icon" onClick={()=>send()}><Send size={16}/></Button></div></div></Modal>;
}

function SupportView(){return <section><p className="font-bold text-primary">SUPORTE</p><h1 className="text-3xl font-bold">Fale com os produtores do site</h1><div className="mt-6 grid gap-5 md:grid-cols-2"><div className="surface-vintage p-6"><Headphones className="text-primary"/><h2 className="mt-3 text-xl font-bold">Central de atendimento</h2><p className="mt-2 text-muted-foreground">Envie dúvidas, sugestões, problemas de cadastro ou relatos sobre a plataforma.</p><SupportForm/></div><div className="rounded-xl bg-accent p-6"><b className="text-xl">Equipe Carita's Pets</b><p className="mt-2">Atendimento da equipe responsável pelo projeto e pela experiência da plataforma.</p><p className="mt-4 text-sm">Para questões sobre um pet específico, use o chat do próprio anúncio.</p></div></div></section>}

function SupportForm(){const [sent,setSent]=useState(false);return <div className="mt-5 space-y-3"><input className="input-vintage" placeholder="Seu nome"/><input className="input-vintage" placeholder="E-mail"/><textarea className="input-vintage min-h-28" placeholder="Como podemos ajudar?"/><Button onClick={()=>setSent(true)}>{sent?"Mensagem enviada!":"Enviar para suporte"}</Button></div>}

function AdminView({pets,setPets,campaigns,setCampaigns,messages}:{pets:Pet[];setPets:React.Dispatch<React.SetStateAction<Pet[]>>;campaigns:Campaign[];setCampaigns:React.Dispatch<React.SetStateAction<Campaign[]>>;messages:Record<string,Message[]>}){
 const [tab,setTab]=useState<"pets"|"ong"|"chats"|"vaquinhas">("pets");const [name,setName]=useState("");const [photo,setPhoto]=useState("");const [meta,setMeta]=useState("");
 return <section><p className="font-bold text-primary">ADMINISTRAÇÃO · MOCK</p><h1 className="text-3xl font-bold">Painel da Carita's Pets</h1><div className="mt-5 flex flex-wrap gap-2">{(["pets","ong","chats","vaquinhas"] as const).map(t=><Button key={t} variant={tab===t?"default":"secondary"} onClick={()=>setTab(t)}>{t==="pets"?"Pets":t==="ong"?"ONGs/Protetores":t==="chats"?"Chats":"Vaquinhas"}</Button>)}</div>
 {tab==="pets"&&<div className="mt-5 surface-vintage p-5"><h2 className="text-xl font-bold">Cadastrar pet real</h2><div className="mt-3 grid gap-2 md:grid-cols-3"><input className="input-vintage" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)}/><input className="input-vintage" placeholder="URL da foto" value={photo} onChange={e=>setPhoto(e.target.value)}/><Button onClick={()=>{if(name){setPets(p=>[...p,{id:crypto.randomUUID(),nome:name,especie:"Cão",idade:"A informar",regiao:"DF",foto:photo||initialPets[0].foto,temperamento:"A informar",doador:"Cadastro admin"}]);setName("");setPhoto("")}}><Plus/>Cadastrar</Button></div><div className="mt-5 space-y-2">{pets.map(p=><div className="flex items-center justify-between rounded border bg-white p-3" key={p.id}><span>{p.nome} · {p.especie}</span><button onClick={()=>setPets(list=>list.filter(x=>x.id!==p.id))}><Trash2 size={17}/></button></div>)}</div></div>}
 {tab==="ong"&&<div className="mt-5 surface-vintage p-5"><h2 className="text-xl font-bold">ONGs e protetores</h2><p className="mt-2 text-muted-foreground">Área preparada para cadastro e verificação dos parceiros.</p><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded bg-secondary p-4"><b>Patinhas do Cerrado</b><p>ONG · Brasília - DF</p></div><div className="rounded bg-secondary p-4"><b>Ana Protetora</b><p>Protetora independente · DF</p></div></div></div>}
 {tab==="chats"&&<div className="mt-5 space-y-3">{Object.keys(messages).map(id=><div className="surface-vintage p-4" key={id}><b>Chat do pet: {id}</b><p>{messages[id].length} mensagens salvas</p></div>)}</div>}
 {tab==="vaquinhas"&&<div className="mt-5 surface-vintage p-5"><h2 className="text-xl font-bold">Cadastrar campanha</h2><div className="mt-3 grid gap-2 md:grid-cols-3"><input className="input-vintage" placeholder="Título" value={name} onChange={e=>setName(e.target.value)}/><input className="input-vintage" placeholder="Meta em R$" value={meta} onChange={e=>setMeta(e.target.value)}/><Button onClick={()=>{if(name){setCampaigns(c=>[...c,{id:crypto.randomUUID(),titulo:name,foto:initialCampaigns[0].foto,arrecadado:0,meta:Number(meta)||0,pix:"chave-pix-a-cadastrar"}]);setName("");setMeta("")}}><Plus/>Cadastrar campanha</Button></div><div className="mt-5 space-y-2">{campaigns.map(c=><div className="rounded border bg-white p-3" key={c.id}><b>{c.titulo}</b><p>{brl(c.arrecadado)} / {brl(c.meta)}</p></div>)}</div></div>}
 </section>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block text-sm font-semibold">{label}{children}</label>}
function Modal({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}){return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><header className="flex items-center justify-between border-b p-4"><h2 className="text-xl font-bold text-primary">{title}</h2><button onClick={close}><X/></button></header><div className="p-5">{children}</div></section></div>}
function SupportModal({close}:{close:()=>void}){return <Modal title="Suporte" close={close}><SupportForm/></Modal>}
