export type CategoriaVaquinha = "Saúde/Cirurgia" | "Ração/Alimentação" | "Castração" | "Abrigo/Infraestrutura";
export type StatusVaquinha = "Em andamento" | "Meta Atingida";

export type PrestacaoConta = {
  data: string;
  titulo: string;
  descricao: string;
  valor?: number;
  foto?: string;
};

export type Vaquinha = {
  id: string;
  pet: string;
  foto: string;
  categoria: CategoriaVaquinha;
  status: StatusVaquinha;
  doadorId: string;
  doador: string;
  meta: number;
  arrecadado: number;
  diasRestantes: number;
  resumo: string;
  historia: string;
  diagnostico: string;
  laudo: { titulo: string; imagem: string };
  orcamento: { item: string; valor: number }[];
  pix: { chave: string; tipo: string; titular: string };
  prestacaoContas: PrestacaoConta[];
};

export const vaquinhas: Vaquinha[] = [
  {
    id: "cirurgia-do-bidu",
    pet: "Bidu",
    foto: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80",
    categoria: "Saúde/Cirurgia",
    status: "Em andamento",
    doadorId: "amigos-quatro-patas",
    doador: "ONG Amigos de Quatro Patas",
    meta: 4800,
    arrecadado: 3120,
    diasRestantes: 12,
    resumo: "Cirurgia ortopédica no fêmur após atropelamento na EPTG.",
    historia:
      "Bidu foi encontrado caído no acostamento da EPTG, em Ceilândia, com dificuldade de locomoção. Levado às pressas para a clínica parceira, o raio-X confirmou fratura no fêmur direito. Ele está estabilizado, se alimentando bem e recebendo analgesia, mas precisa da cirurgia com urgência para voltar a caminhar.",
    diagnostico:
      "Fratura diafisária completa de fêmur direito com necessidade de osteossíntese com placa e parafusos. Sem indicação de tratamento conservador.",
    laudo: {
      titulo: "Laudo radiográfico - Clínica Vet Cerrado (18/08/2026)",
      imagem: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80",
    },
    orcamento: [
      { item: "Cirurgia de osteossíntese", valor: 3200 },
      { item: "Placa, parafusos e materiais", valor: 900 },
      { item: "Internação e medicações pós-operatórias", valor: 450 },
      { item: "Fisioterapia (4 sessões)", valor: 250 },
    ],
    pix: { chave: "11.222.333/0001-44", tipo: "CNPJ", titular: "Amigos de Quatro Patas" },
    prestacaoContas: [
      {
        data: "20/08/2026",
        titulo: "Nota fiscal - exames de imagem",
        descricao: "Raio-X em duas incidências e hemograma pré-operatório na Clínica Vet Cerrado.",
        valor: 380,
        foto: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      },
      {
        data: "25/08/2026",
        titulo: "Recibo de medicações",
        descricao: "Analgésicos e anti-inflamatórios para o período pré-cirúrgico.",
        valor: 165,
      },
    ],
  },
  {
    id: "castracao-colonia-planaltina",
    pet: "Colônia de Planaltina (12 gatos)",
    foto: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=900&q=80",
    categoria: "Castração",
    status: "Em andamento",
    doadorId: "lar-felino-df",
    doador: "ONG Lar Felino DF",
    meta: 3600,
    arrecadado: 1450,
    diasRestantes: 25,
    resumo: "Mutirão de castração para 12 gatos resgatados de uma colônia em Planaltina.",
    historia:
      "Uma colônia de 12 gatos vivia em um terreno baldio de Planaltina, com reprodução descontrolada e alta incidência de doenças. Após a triagem veterinária, todos precisam ser castrados antes de irem para lares temporários e entrarem no catálogo de adoção.",
    diagnostico:
      "Animais clinicamente estáveis, testados para FIV/FeLV, com indicação de castração eletiva e vermifugação.",
    laudo: {
      titulo: "Relatório de triagem felina - Clínica Miau DF (26/08/2026)",
      imagem: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=80",
    },
    orcamento: [
      { item: "12 castrações (valor social)", valor: 2400 },
      { item: "Testes FIV/FeLV", valor: 720 },
      { item: "Vermífugos e antipulgas", valor: 280 },
      { item: "Transporte dos animais", valor: 200 },
    ],
    pix: { chave: "98.765.432/0001-10", tipo: "CNPJ", titular: "Lar Felino DF" },
    prestacaoContas: [
      {
        data: "27/08/2026",
        titulo: "Nota fiscal - testes FIV/FeLV",
        descricao: "12 testes rápidos realizados na triagem inicial da colônia.",
        valor: 720,
      },
    ],
  },
  {
    id: "racao-patinhas",
    pet: "Lar temporário Patinhas (28 animais)",
    foto: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=900&q=80",
    categoria: "Ração/Alimentação",
    status: "Em andamento",
    doadorId: "patinhas-do-cerrado",
    doador: "ONG Patinhas do Cerrado",
    meta: 2400,
    arrecadado: 2050,
    diasRestantes: 6,
    resumo: "Compra de ração mensal para 28 cães e gatos em lares temporários.",
    historia:
      "Nossos lares temporários abrigam hoje 28 animais em recuperação. O consumo mensal é de aproximadamente 180 kg de ração, além de alimentação úmida para os filhotes e idosos. A campanha garante o estoque do próximo mês.",
    diagnostico: "Animais saudáveis em manutenção nutricional; filhotes e idosos com dieta específica prescrita.",
    laudo: {
      titulo: "Prescrição nutricional - Clínica Vet Cerrado (01/08/2026)",
      imagem: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1200&q=80",
    },
    orcamento: [
      { item: "180 kg de ração adulto premium", valor: 1560 },
      { item: "Ração filhotes (40 kg)", valor: 520 },
      { item: "Alimentação úmida (sachês)", valor: 320 },
    ],
    pix: { chave: "12.345.678/0001-90", tipo: "CNPJ", titular: "Patinhas do Cerrado" },
    prestacaoContas: [
      {
        data: "05/08/2026",
        titulo: "Nota fiscal - compra de ração (julho)",
        descricao: "Compra do mês anterior comprovada junto ao fornecedor parceiro.",
        valor: 1490,
        foto: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&q=80",
      },
    ],
  },
  {
    id: "tratamento-amora",
    pet: "Amora",
    foto: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=900&q=80",
    categoria: "Saúde/Cirurgia",
    status: "Meta Atingida",
    doadorId: "rafael-m",
    doador: "Protetor Rafael M.",
    meta: 1200,
    arrecadado: 1200,
    diasRestantes: 0,
    resumo: "Tratamento completo de infecção respiratória felina. Meta atingida!",
    historia:
      "Amora chegou com secreção ocular intensa e dificuldade respiratória. Graças às doações, concluímos todo o tratamento e ela está recuperada e disponível para adoção.",
    diagnostico: "Complexo respiratório felino com infecção bacteriana secundária; tratamento com antibioticoterapia por 21 dias.",
    laudo: {
      titulo: "Laudo clínico - Clínica Miau DF (02/08/2026)",
      imagem: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80",
    },
    orcamento: [
      { item: "Consultas e reavaliações", valor: 400 },
      { item: "Antibióticos e colírios", valor: 500 },
      { item: "Exames laboratoriais", valor: 300 },
    ],
    pix: { chave: "(61) 99876-5432", tipo: "Celular", titular: "Rafael M." },
    prestacaoContas: [
      {
        data: "10/08/2026",
        titulo: "Recibo de consultas",
        descricao: "Três consultas de acompanhamento realizadas durante o tratamento.",
        valor: 400,
      },
      {
        data: "24/08/2026",
        titulo: "Foto da recuperação",
        descricao: "Amora recuperada, sem secreção ocular e ganhando peso.",
        foto: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
      },
    ],
  },
  {
    id: "abrigo-taguatinga",
    pet: "Canil do lar temporário da Ana Lúcia",
    foto: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=900&q=80",
    categoria: "Abrigo/Infraestrutura",
    status: "Em andamento",
    doadorId: "ana-lucia",
    doador: "Protetora Ana Lúcia",
    meta: 5000,
    arrecadado: 900,
    diasRestantes: 40,
    resumo: "Cobertura e piso lavável para o canil do lar temporário em Taguatinga.",
    historia:
      "O espaço onde os cães ficam durante o dia não tem cobertura adequada, o que expõe os animais ao sol forte e à chuva. A obra prevê telhado e piso lavável para 14 cães.",
    diagnostico: "Não se aplica: campanha de infraestrutura com orçamento de material e mão de obra.",
    laudo: {
      titulo: "Orçamento de obra - Construtora parceira (14/08/2026)",
      imagem: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
    },
    orcamento: [
      { item: "Estrutura metálica e telhas", valor: 2600 },
      { item: "Piso lavável e rejunte", valor: 1400 },
      { item: "Mão de obra", valor: 1000 },
    ],
    pix: { chave: "ana.lucia.protetora@email.com", tipo: "E-mail", titular: "Ana Lúcia S." },
    prestacaoContas: [],
  },
];
