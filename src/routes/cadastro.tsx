import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { lerRascunho, limparRascunho, useAutoSave, type RascunhoSalvo } from "@/lib/rascunho";
import { salvarAdotante } from "@/lib/adotante";
import {
  buscarCEP,
  cnpjValido,
  cpfValido,
  emailValido,
  mascaraCEP,
  mascaraCNPJ,
  mascaraCPF,
  mascaraTelefone,
  somenteDigitos,
} from "@/lib/validacao";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro | Carita's Pets" },
      {
        name: "description",
        content:
          "Cadastro completo de Adotante, ONG ou Protetor Independente, com validação de CPF/CNPJ, endereço no DF, documentos e termo de posse responsável.",
      },
      { property: "og:title", content: "Cadastro | Carita's Pets" },
      {
        property: "og:description",
        content: "Três perfis de cadastro com validação de dados: ONG, Protetor Independente e Adotante.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cadastro,
});

type Perfil = "adotante" | "ong" | "protetor";

const perfis: { id: Perfil; titulo: string; texto: string }[] = [
  {
    id: "adotante",
    titulo: "Adotante",
    texto: "Pessoa física que deseja adotar. Exige comprovante de residência e questionário.",
  },
  { id: "ong", titulo: "ONG", texto: "Pessoa jurídica com CNPJ, estatuto social e dados financeiros." },
  {
    id: "protetor",
    titulo: "Protetor Independente",
    texto: "Pessoa física doadora, com comprovação de atuação em resgates.",
  },
];

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground outline-none focus:ring-2 focus:ring-ring";

function Campo({
  label,
  obrigatorio,
  erro,
  children,
  larga,
}: {
  label: string;
  obrigatorio?: boolean;
  erro?: string | undefined;
  children: React.ReactNode;
  larga?: boolean;
}) {
  return (
    <label className={`text-base ${larga ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block text-foreground">
        {label} {obrigatorio && <span className="text-destructive">*</span>}
      </span>
      {children}
      {erro && (
        <span className="mt-1 block rounded bg-destructive/10 px-2 py-1 text-sm text-destructive">
          {erro}
        </span>
      )}
    </label>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="surface-vintage p-6">
      <h2 className="text-xl font-semibold text-primary">{titulo}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

type Erros = Record<string, string>;

function Cadastro() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<Perfil>("adotante");
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState(false);

  // campos comuns
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");

  // OTP
  const [otpEnviado, setOtpEnviado] = useState(false);
  const [otpCodigo, setOtpCodigo] = useState("");
  const [otpVerificado, setOtpVerificado] = useState(false);

  // endereço
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [comprovante, setComprovante] = useState("");

  // questionário adotante
  const [moradia, setMoradia] = useState("");
  const [redes, setRedes] = useState("");
  const [muros, setMuros] = useState("");
  const [permissao, setPermissao] = useState("");
  const [outrosPets, setOutrosPets] = useState("");
  const [historico, setHistorico] = useState("");
  const [termo, setTermo] = useState(false);

  // ONG
  const [razao, setRazao] = useState("");
  const [fantasia, setFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [fundacao, setFundacao] = useState("");
  const [respNome, setRespNome] = useState("");
  const [respCpf, setRespCpf] = useState("");
  const [respCargo, setRespCargo] = useState("");
  const [respWhats, setRespWhats] = useState("");
  const [estatuto, setEstatuto] = useState("");
  const [redeSocial, setRedeSocial] = useState("");
  const [pix, setPix] = useState("");
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");

  // Protetor
  const [rg, setRg] = useState("");
  const [historicoResgates, setHistoricoResgates] = useState("");
  const [fotosAtendimento, setFotosAtendimento] = useState(0);

  // ---- Rascunho automático (auto-save) ----
  const campos = {
    perfil,
    nome,
    cpf,
    email,
    nascimento,
    telefone,
    cep,
    logradouro,
    bairro,
    cidade,
    uf,
    numero,
    complemento,
    moradia,
    redes,
    muros,
    permissao,
    outrosPets,
    historico,
    razao,
    fantasia,
    cnpj,
    fundacao,
    respNome,
    respCpf,
    respCargo,
    respWhats,
    redeSocial,
    pix,
    banco,
    agencia,
    conta,
    rg,
    historicoResgates,
  };
  type Campos = typeof campos;

  const setters: Record<keyof Campos, (v: string) => void> = {
    perfil: (v) => setPerfil(v as Perfil),
    nome: setNome,
    cpf: setCpf,
    email: setEmail,
    nascimento: setNascimento,
    telefone: setTelefone,
    cep: setCep,
    logradouro: setLogradouro,
    bairro: setBairro,
    cidade: setCidade,
    uf: setUf,
    numero: setNumero,
    complemento: setComplemento,
    moradia: setMoradia,
    redes: setRedes,
    muros: setMuros,
    permissao: setPermissao,
    outrosPets: setOutrosPets,
    historico: setHistorico,
    razao: setRazao,
    fantasia: setFantasia,
    cnpj: setCnpj,
    fundacao: setFundacao,
    respNome: setRespNome,
    respCpf: setRespCpf,
    respCargo: setRespCargo,
    respWhats: setRespWhats,
    redeSocial: setRedeSocial,
    pix: setPix,
    banco: setBanco,
    agencia: setAgencia,
    conta: setConta,
    rg: setRg,
    historicoResgates: setHistoricoResgates,
  };

  const autoSave = useAutoSave("cadastro", "cadastro de perfil", campos, !enviado);
  const [rascunho, setRascunho] = useState<RascunhoSalvo<Campos> | null>(null);

  useEffect(() => {
    const r = lerRascunho<Campos>("cadastro");
    if (r) setRascunho(r);
  }, []);

  function restaurarRascunho() {
    if (!rascunho) return;
    (Object.keys(setters) as (keyof Campos)[]).forEach((k) => {
      const valor = rascunho.dados[k];
      if (typeof valor === "string" && valor) setters[k](valor);
    });
    setRascunho(null);
  }


  function onCep(valor: string) {
    const v = mascaraCEP(valor);
    setCep(v);
    const encontrado = buscarCEP(v);
    if (encontrado) {
      setLogradouro(encontrado.logradouro);
      setBairro(encontrado.bairro);
      setCidade(encontrado.cidade);
      setUf(encontrado.uf);
      setErros((e) => ({ ...e, cep: "" }));
    } else if (somenteDigitos(v).length === 8) {
      setLogradouro("");
      setBairro("");
      setCidade("");
      setUf("");
      setErros((e) => ({
        ...e,
        cep: "Atendemos apenas Brasília - DF e entorno. Verifique o CEP informado.",
      }));
    }
  }

  function enviarOtp() {
    if (somenteDigitos(telefone).length < 10) {
      setErros((e) => ({ ...e, telefone: "Informe um telefone válido com DDD." }));
      return;
    }
    setOtpEnviado(true);
    setErros((e) => ({ ...e, telefone: "", otp: "" }));
  }

  function validarOtp() {
    if (somenteDigitos(otpCodigo).length === 6) {
      setOtpVerificado(true);
      setErros((e) => ({ ...e, otp: "" }));
    } else {
      setErros((e) => ({ ...e, otp: "Digite os 6 dígitos recebidos por SMS." }));
    }
  }

  function validar(): Erros {
    const e: Erros = {};
    if (perfil === "adotante") {
      if (nome.trim().length < 5) e["nome"] = "Informe seu nome completo.";
      if (!cpfValido(cpf)) e["cpf"] = "CPF inválido. Confira os números digitados.";
      if (!nascimento) e["nascimento"] = "Informe sua data de nascimento.";
      if (!otpVerificado) e["otp"] = "Verifique seu telefone por SMS antes de continuar.";
      if (!emailValido(email)) e["email"] = "Informe um e-mail válido.";
      if (senha.length < 6) e["senha"] = "A senha precisa ter ao menos 6 caracteres.";
      if (!cidade) e["cep"] = "Informe um CEP de Brasília - DF ou entorno.";
      if (!numero.trim()) e["numero"] = "Informe o número do endereço.";
      if (!comprovante) e["comprovante"] = "Envie o comprovante de residência (PDF, PNG ou JPG).";
      if (!moradia) e["moradia"] = "Selecione o tipo de moradia.";
      if (!redes) e["redes"] = "Informe se há redes de proteção.";
      if (!muros) e["muros"] = "Informe se o quintal é seguro.";
      if (!permissao) e["permissao"] = "Informe se o imóvel permite animais.";
      if (!outrosPets) e["outrosPets"] = "Informe se há outros pets na casa.";
      if (!historico.trim()) e["historico"] = "Conte seu histórico com animais anteriores.";
      if (!termo) e["termo"] = "É obrigatório aceitar o Termo de Posse Responsável.";
    }
    if (perfil === "ong") {
      if (razao.trim().length < 3) e["razao"] = "Informe a razão social.";
      if (fantasia.trim().length < 2) e["fantasia"] = "Informe o nome fantasia.";
      if (!cnpjValido(cnpj)) e["cnpj"] = "CNPJ inválido. Confira os números digitados.";
      if (!/^\d{4}$/.test(fundacao)) e["fundacao"] = "Informe o ano de fundação (4 dígitos).";
      if (!cidade) e["cep"] = "Endereço comercial deve ser em Brasília - DF.";
      if (!numero.trim()) e["numero"] = "Informe o número do endereço.";
      if (respNome.trim().length < 5) e["respNome"] = "Informe o nome do responsável legal.";
      if (!cpfValido(respCpf)) e["respCpf"] = "CPF do responsável inválido.";
      if (!respCargo.trim()) e["respCargo"] = "Informe o cargo na ONG.";
      if (somenteDigitos(respWhats).length < 10) e["respWhats"] = "Informe o WhatsApp com DDD.";
      if (!emailValido(email)) e["email"] = "Informe um e-mail válido.";
      if (!estatuto) e["estatuto"] = "Anexe o Estatuto Social ou o Cartão CNPJ.";
      if (!redeSocial.trim()) e["redeSocial"] = "Informe o link de uma rede social oficial.";
      if (!pix.trim()) e["pix"] = "Informe a chave PIX vinculada ao CNPJ.";
      if (!banco.trim()) e["banco"] = "Informe o banco.";
      if (!agencia.trim()) e["agencia"] = "Informe a agência.";
      if (!conta.trim()) e["conta"] = "Informe a conta corrente.";
    }
    if (perfil === "protetor") {
      if (nome.trim().length < 5) e["nome"] = "Informe seu nome completo.";
      if (!cpfValido(cpf)) e["cpf"] = "CPF inválido. Confira os números digitados.";
      if (!rg.trim()) e["rg"] = "Informe o número do RG.";
      if (!nascimento) e["nascimento"] = "Informe sua data de nascimento.";
      if (somenteDigitos(telefone).length < 10) e["telefone"] = "Informe o telefone com DDD.";
      if (!emailValido(email)) e["email"] = "Informe um e-mail válido.";
      if (!cidade) e["cep"] = "Informe um endereço em Brasília - DF.";
      if (!numero.trim()) e["numero"] = "Informe o número do endereço.";
      if (historicoResgates.trim().length < 20)
        e["historicoResgates"] = "Descreva seu histórico de resgates (mínimo 20 caracteres).";
      if (!redeSocial.trim() && fotosAtendimento < 2)
        e["comprovacao"] =
          "Informe um link de rede social ativa ou envie 2 fotos/comprovantes de atendimentos veterinários.";
      if (!pix.trim()) e["pix"] = "Informe a chave PIX (CPF, e-mail ou celular do titular).";
    }
    return e;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length > 0) {
      document.querySelector("[data-erro-topo]")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    limparRascunho("cadastro");
    if (perfil === "adotante") {
      salvarAdotante({ nome, email, cidade: `${cidade} - ${uf}`, comprovante });
      navigate({ to: "/pets" });
      return;
    }
    setEnviado(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const totalErros = Object.values(erros).filter(Boolean).length;

  const endereco = (
    <Secao titulo={perfil === "ong" ? "Endereço comercial / correspondência" : "Endereço"}>
      <Campo label="CEP" obrigatorio erro={erros["cep"]}>
        <input
          value={cep}
          onChange={(e) => onCep(e.target.value)}
          placeholder="70000-000"
          inputMode="numeric"
          className={inputClass}
        />
      </Campo>
      <Campo label="Logradouro (preenchido automaticamente)">
        <input value={logradouro} readOnly className={`${inputClass} bg-muted`} />
      </Campo>
      <Campo label="Bairro">
        <input value={bairro} readOnly className={`${inputClass} bg-muted`} />
      </Campo>
      <Campo label="Cidade / UF">
        <input value={cidade ? `${cidade} / ${uf}` : ""} readOnly className={`${inputClass} bg-muted`} />
      </Campo>
      <Campo label="Número" obrigatorio erro={erros["numero"]}>
        <input value={numero} onChange={(e) => setNumero(e.target.value)} className={inputClass} />
      </Campo>
      <Campo label="Complemento">
        <input
          value={complemento}
          onChange={(e) => setComplemento(e.target.value)}
          placeholder="Bloco, apartamento, casa..."
          className={inputClass}
        />
      </Campo>
    </Secao>
  );

  return (
    <SiteLayout>
      <h1 className="text-3xl font-bold text-foreground">Cadastro</h1>
      <p className="mt-2 max-w-3xl text-base text-muted-foreground">
        Para garantir a segurança dos animais e a veracidade das informações, cada perfil possui
        etapas próprias de validação. Campos com <span className="text-destructive">*</span> são
        obrigatórios.
      </p>

      <fieldset className="mt-6 grid gap-4 md:grid-cols-3">
        <legend className="sr-only">Selecione seu perfil</legend>
        {perfis.map((p) => (
          <label
            key={p.id}
            className={`surface-vintage cursor-pointer p-5 transition-colors ${
              perfil === p.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <input
              type="radio"
              name="perfil"
              value={p.id}
              checked={perfil === p.id}
              onChange={() => {
                setPerfil(p.id);
                setErros({});
                setEnviado(false);
              }}
              className="sr-only"
            />
            <span className="block text-lg font-semibold text-primary">{p.titulo}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{p.texto}</span>
          </label>
        ))}
      </fieldset>

      <div data-erro-topo />

      {enviado && (
        <p className="mt-6 rounded-md bg-accent/70 px-4 py-3 text-base text-accent-foreground">
          Cadastro enviado! Nossa equipe vai conferir os documentos e entrar em contato por e-mail
          para liberar o perfil verificado em Brasília - DF.
        </p>
      )}

      {totalErros > 0 && (
        <p
          role="alert"
          className="mt-6 rounded-md bg-destructive/10 px-4 py-3 text-base text-destructive"
        >
          Encontramos {totalErros} campo(s) para revisar. Confira as mensagens destacadas abaixo —
          está quase lá!
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {perfil === "adotante" && (
          <>
            <Secao titulo="Dados pessoais">
              <Campo label="Nome completo" obrigatorio erro={erros["nome"]}>
                <input value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass} />
              </Campo>
              <Campo label="CPF" obrigatorio erro={erros["cpf"]}>
                <input
                  value={cpf}
                  onChange={(e) => setCpf(mascaraCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  className={inputClass}
                />
              </Campo>
              <Campo label="Data de nascimento" obrigatorio erro={erros["nascimento"]}>
                <input
                  type="date"
                  value={nascimento}
                  onChange={(e) => setNascimento(e.target.value)}
                  className={inputClass}
                />
              </Campo>
              <Campo label="Telefone / WhatsApp" obrigatorio erro={erros["telefone"]}>
                <div className="flex gap-2">
                  <input
                    value={telefone}
                    onChange={(e) => {
                      setTelefone(mascaraTelefone(e.target.value));
                      setOtpVerificado(false);
                      setOtpEnviado(false);
                    }}
                    placeholder="(61) 90000-0000"
                    inputMode="numeric"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={enviarOtp}
                    className="shrink-0 rounded-md bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:bg-secondary/80"
                  >
                    Enviar SMS
                  </button>
                </div>
              </Campo>
              {otpEnviado && !otpVerificado && (
                <Campo label="Código de verificação (SMS)" obrigatorio erro={erros["otp"]} larga>
                  <div className="flex gap-2">
                    <input
                      value={otpCodigo}
                      onChange={(e) => setOtpCodigo(somenteDigitos(e.target.value).slice(0, 6))}
                      placeholder="000000"
                      inputMode="numeric"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={validarOtp}
                      className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                    >
                      Validar código
                    </button>
                  </div>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    Enviamos um código de 6 dígitos para {telefone}.
                  </span>
                </Campo>
              )}
              {otpVerificado && (
                <p className="text-base text-primary md:col-span-2">✓ Telefone verificado por SMS.</p>
              )}
              {!otpVerificado && erros["otp"] && !otpEnviado && (
                <p className="text-base text-destructive md:col-span-2">{erros["otp"]}</p>
              )}
              <Campo label="E-mail" obrigatorio erro={erros["email"]}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </Campo>
              <Campo label="Senha" obrigatorio erro={erros["senha"]}>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={inputClass}
                />
              </Campo>
            </Secao>

            {endereco}

            <Secao titulo="Comprovante de residência">
              <Campo
                label="Envie o comprovante (PDF, PNG ou JPG)"
                obrigatorio
                erro={erros["comprovante"]}
                larga
              >
                <input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg"
                  onChange={(e) => setComprovante(e.target.files?.[0]?.name ?? "")}
                  className={inputClass}
                />
                {comprovante && (
                  <span className="mt-1 block text-sm text-primary">Arquivo: {comprovante}</span>
                )}
              </Campo>
            </Secao>

            <Secao titulo="Questionário de adoção (formulário censo)">
              <Campo label="Tipo de moradia" obrigatorio erro={erros["moradia"]}>
                <select value={moradia} onChange={(e) => setMoradia(e.target.value)} className={inputClass}>
                  <option value="">Selecione</option>
                  <option>Casa</option>
                  <option>Apartamento</option>
                </select>
              </Campo>
              <Campo
                label="Possui redes de proteção em janelas/varandas?"
                obrigatorio
                erro={erros["redes"]}
              >
                <select value={redes} onChange={(e) => setRedes(e.target.value)} className={inputClass}>
                  <option value="">Selecione</option>
                  <option>Sim, já instaladas</option>
                  <option>Não, mas pretendo instalar</option>
                  <option>Não</option>
                </select>
              </Campo>
              <Campo label="Muros altos / quintal seguro?" obrigatorio erro={erros["muros"]}>
                <select value={muros} onChange={(e) => setMuros(e.target.value)} className={inputClass}>
                  <option value="">Selecione</option>
                  <option>Sim</option>
                  <option>Parcialmente</option>
                  <option>Não</option>
                </select>
              </Campo>
              <Campo
                label="O imóvel permite animais (se alugado)?"
                obrigatorio
                erro={erros["permissao"]}
              >
                <select
                  value={permissao}
                  onChange={(e) => setPermissao(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecione</option>
                  <option>Imóvel próprio</option>
                  <option>Alugado, com permissão</option>
                  <option>Alugado, sem permissão</option>
                </select>
              </Campo>
              <Campo label="Existem outros pets na casa?" obrigatorio erro={erros["outrosPets"]}>
                <select
                  value={outrosPets}
                  onChange={(e) => setOutrosPets(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecione</option>
                  <option>Não</option>
                  <option>Sim, cães</option>
                  <option>Sim, gatos</option>
                  <option>Sim, cães e gatos</option>
                </select>
              </Campo>
              <Campo label="Histórico de animais anteriores" obrigatorio erro={erros["historico"]} larga>
                <textarea
                  rows={4}
                  value={historico}
                  onChange={(e) => setHistorico(e.target.value)}
                  placeholder="Conte se já teve pets, por quanto tempo e como foi a experiência."
                  className={inputClass}
                />
              </Campo>
            </Secao>

            <section className="surface-vintage p-6">
              <h2 className="text-xl font-semibold text-primary">Termo de compromisso</h2>
              <label className="mt-3 flex items-start gap-3 text-base text-foreground">
                <input
                  type="checkbox"
                  checked={termo}
                  onChange={(e) => setTermo(e.target.checked)}
                  className="mt-1 h-5 w-5"
                />
                <span>
                  Li e aceito o <strong>Termo de Posse Responsável</strong> e autorizo visitas
                  virtuais ou presenciais de acompanhamento pós-adoção.{" "}
                  <span className="text-destructive">*</span>
                </span>
              </label>
              {erros["termo"] && (
                <p className="mt-2 rounded bg-destructive/10 px-2 py-1 text-sm text-destructive">
                  {erros["termo"]}
                </p>
              )}
            </section>
          </>
        )}

        {perfil === "ong" && (
          <>
            <Secao titulo="Dados institucionais">
              <Campo label="Razão social" obrigatorio erro={erros["razao"]}>
                <input value={razao} onChange={(e) => setRazao(e.target.value)} className={inputClass} />
              </Campo>
              <Campo label="Nome fantasia" obrigatorio erro={erros["fantasia"]}>
                <input
                  value={fantasia}
                  onChange={(e) => setFantasia(e.target.value)}
                  className={inputClass}
                />
              </Campo>
              <Campo label="CNPJ" obrigatorio erro={erros["cnpj"]}>
                <input
                  value={cnpj}
                  onChange={(e) => setCnpj(mascaraCNPJ(e.target.value))}
                  placeholder="00.000.000/0000-00"
                  inputMode="numeric"
                  className={inputClass}
                />
              </Campo>
              <Campo label="Ano de fundação" obrigatorio erro={erros["fundacao"]}>
                <input
                  value={fundacao}
                  onChange={(e) => setFundacao(somenteDigitos(e.target.value).slice(0, 4))}
                  placeholder="2015"
                  inputMode="numeric"
                  className={inputClass}
                />
              </Campo>
              <Campo label="E-mail institucional" obrigatorio erro={erros["email"]}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </Campo>
            </Secao>

            {endereco}

            <Secao titulo="Responsável legal">
              <Campo label="Nome completo" obrigatorio erro={erros["respNome"]}>
                <input
                  value={respNome}
                  onChange={(e) => setRespNome(e.target.value)}
                  className={inputClass}
                />
              </Campo>
              <Campo label="CPF" obrigatorio erro={erros["respCpf"]}>
                <input
                  value={respCpf}
                  onChange={(e) => setRespCpf(mascaraCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  className={inputClass}
                />
              </Campo>
              <Campo label="Cargo na ONG" obrigatorio erro={erros["respCargo"]}>
                <input
                  value={respCargo}
                  onChange={(e) => setRespCargo(e.target.value)}
                  placeholder="Presidente, diretor(a)..."
                  className={inputClass}
                />
              </Campo>
              <Campo label="WhatsApp de contato direto" obrigatorio erro={erros["respWhats"]}>
                <input
                  value={respWhats}
                  onChange={(e) => setRespWhats(mascaraTelefone(e.target.value))}
                  placeholder="(61) 90000-0000"
                  inputMode="numeric"
                  className={inputClass}
                />
              </Campo>
            </Secao>

            <Secao titulo="Comprovação de legitimidade">
              <Campo label="Estatuto Social ou Cartão CNPJ (PDF, PNG ou JPG)" obrigatorio erro={erros["estatuto"]}>
                <input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg"
                  onChange={(e) => setEstatuto(e.target.files?.[0]?.name ?? "")}
                  className={inputClass}
                />
                {estatuto && <span className="mt-1 block text-sm text-primary">Arquivo: {estatuto}</span>}
              </Campo>
              <Campo label="Link das redes sociais oficiais" obrigatorio erro={erros["redeSocial"]}>
                <input
                  value={redeSocial}
                  onChange={(e) => setRedeSocial(e.target.value)}
                  placeholder="https://instagram.com/sua-ong"
                  className={inputClass}
                />
              </Campo>
            </Secao>

            <Secao titulo="Dados financeiros da instituição">
              <Campo label="Chave PIX vinculada ao CNPJ" obrigatorio erro={erros["pix"]}>
                <input value={pix} onChange={(e) => setPix(e.target.value)} className={inputClass} />
              </Campo>
              <Campo label="Banco" obrigatorio erro={erros["banco"]}>
                <input value={banco} onChange={(e) => setBanco(e.target.value)} className={inputClass} />
              </Campo>
              <Campo label="Agência" obrigatorio erro={erros["agencia"]}>
                <input value={agencia} onChange={(e) => setAgencia(e.target.value)} className={inputClass} />
              </Campo>
              <Campo label="Conta corrente" obrigatorio erro={erros["conta"]}>
                <input value={conta} onChange={(e) => setConta(e.target.value)} className={inputClass} />
              </Campo>
            </Secao>
          </>
        )}

        {perfil === "protetor" && (
          <>
            <Secao titulo="Dados pessoais">
              <Campo label="Nome completo" obrigatorio erro={erros["nome"]}>
                <input value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass} />
              </Campo>
              <Campo label="CPF" obrigatorio erro={erros["cpf"]}>
                <input
                  value={cpf}
                  onChange={(e) => setCpf(mascaraCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  className={inputClass}
                />
              </Campo>
              <Campo label="RG" obrigatorio erro={erros["rg"]}>
                <input value={rg} onChange={(e) => setRg(e.target.value)} className={inputClass} />
              </Campo>
              <Campo label="Data de nascimento" obrigatorio erro={erros["nascimento"]}>
                <input
                  type="date"
                  value={nascimento}
                  onChange={(e) => setNascimento(e.target.value)}
                  className={inputClass}
                />
              </Campo>
              <Campo label="Telefone / WhatsApp" obrigatorio erro={erros["telefone"]}>
                <input
                  value={telefone}
                  onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                  placeholder="(61) 90000-0000"
                  inputMode="numeric"
                  className={inputClass}
                />
              </Campo>
              <Campo label="E-mail" obrigatorio erro={erros["email"]}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </Campo>
            </Secao>

            {endereco}

            <Secao titulo="Comprovação de atuação">
              <Campo
                label="Histórico de resgates"
                obrigatorio
                erro={erros["historicoResgates"]}
                larga
              >
                <textarea
                  rows={4}
                  value={historicoResgates}
                  onChange={(e) => setHistoricoResgates(e.target.value)}
                  placeholder="Conte há quanto tempo atua, quantos animais já resgatou e como mantém os cuidados."
                  className={inputClass}
                />
              </Campo>
              <Campo label="Links de redes sociais ativas com os resgates" erro={erros["comprovacao"]}>
                <input
                  value={redeSocial}
                  onChange={(e) => setRedeSocial(e.target.value)}
                  placeholder="https://instagram.com/seu-perfil"
                  className={inputClass}
                />
              </Campo>
              <Campo label="Ou envie 2 fotos/comprovantes de atendimentos veterinários recentes">
                <input
                  type="file"
                  multiple
                  accept="application/pdf,image/png,image/jpeg"
                  onChange={(e) => setFotosAtendimento(e.target.files?.length ?? 0)}
                  className={inputClass}
                />
                {fotosAtendimento > 0 && (
                  <span className="mt-1 block text-sm text-primary">
                    {fotosAtendimento} arquivo(s) selecionado(s).
                  </span>
                )}
              </Campo>
            </Secao>

            <Secao titulo="Dados financeiros">
              <Campo
                label="Chave PIX (CPF, e-mail ou celular do titular cadastrado)"
                obrigatorio
                erro={erros["pix"]}
                larga
              >
                <input value={pix} onChange={(e) => setPix(e.target.value)} className={inputClass} />
              </Campo>
            </Secao>
          </>
        )}

        {rascunho && (
          <div className="rounded-md border border-primary/30 bg-accent p-4 text-sm text-accent-foreground">
            <p>Você tem um cadastro em andamento. Deseja continuar?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={restaurarRascunho}
                className="rounded-md bg-primary px-4 py-2 text-xs text-primary-foreground"
              >
                Continuar preenchimento
              </button>
              <button
                type="button"
                onClick={() => {
                  limparRascunho("cadastro");
                  setRascunho(null);
                }}
                className="rounded-md border border-input bg-card px-4 py-2 text-xs"
              >
                Começar do zero
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            {perfil === "adotante"
              ? "Concluir cadastro e ver pets"
              : "Enviar cadastro para verificação"}
          </button>
          <button
            type="button"
            onClick={autoSave.salvarAgora}
            className="rounded-md border border-primary/40 bg-card px-6 py-3 text-base text-primary transition-colors hover:bg-accent"
          >
            Salvar para continuar depois
          </button>
        </div>
        {autoSave.texto && (
          <p className="text-sm italic text-primary/80">{autoSave.texto}</p>
        )}
      </form>
    </SiteLayout>
  );
}
