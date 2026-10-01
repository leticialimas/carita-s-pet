export type Publicacao = {
  id: string;
  data: string;
  texto: string;
  foto?: string;
  tag: "Resgate" | "Atualização" | "Final Feliz";
};

export type Doador = {
  id: string;
  nome: string;
  tipo: "ONG" | "Protetor Independente";
  avatar: string;
  missao: string;
  cidade: string;
  redes: { rede: string; url: string }[];
  estatisticas: { resgatados: number; adocoes: number; campanhas: number };
  pix: { chave: string; tipo: string; titular: string };
  banco?: { banco: string; agencia: string; conta: string };
  apadrinhamento: number[];
  feed: Publicacao[];
};

export const doadores: Doador[] = [
  {
    id: "patinhas-do-cerrado",
    nome: "ONG Patinhas do Cerrado",
    tipo: "ONG",
    avatar: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&q=80",
    missao:
      "Resgatamos cães e gatos abandonados nas regiões administrativas do Distrito Federal, oferecendo tratamento veterinário, castração e encaminhamento para lares responsáveis.",
    cidade: "Brasília - DF",
    redes: [
      { rede: "Instagram", url: "https://instagram.com" },
      { rede: "Facebook", url: "https://facebook.com" },
    ],
    estatisticas: { resgatados: 412, adocoes: 287, campanhas: 2 },
    pix: { chave: "12.345.678/0001-90", tipo: "CNPJ", titular: "Patinhas do Cerrado" },
    banco: { banco: "Banco do Brasil (001)", agencia: "3475-1", conta: "18.402-6" },
    apadrinhamento: [30, 60, 120],
    feed: [
      {
        id: "p1",
        data: "28/08/2026",
        tag: "Final Feliz",
        texto:
          "A Mel encontrou seu lar! Depois de 8 meses no lar temporário, ela agora dorme no sofá com a família da Camila, na Asa Norte.",
        foto: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80",
      },
      {
        id: "p2",
        data: "21/08/2026",
        tag: "Resgate",
        texto:
          "Resgate de emergência em Ceilândia: dois filhotes encontrados dentro de uma caixa às margens da via. Ambos já estão vermifugados.",
        foto: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=800&q=80",
      },
      {
        id: "p3",
        data: "12/08/2026",
        tag: "Atualização",
        texto:
          "Mutirão de castração concluído: 34 animais castrados em parceria com clínicas voluntárias do Guará. Obrigada a todos que doaram!",
      },
    ],
  },
  {
    id: "ana-lucia",
    nome: "Protetora Ana Lúcia",
    tipo: "Protetor Independente",
    avatar: "https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?w=400&q=80",
    missao:
      "Cuido de cães resgatados das ruas de Taguatinga há 11 anos, com lar temporário na minha própria casa e apoio de padrinhos mensais.",
    cidade: "Taguatinga - DF",
    redes: [{ rede: "Instagram", url: "https://instagram.com" }],
    estatisticas: { resgatados: 96, adocoes: 74, campanhas: 1 },
    pix: { chave: "ana.lucia.protetora@email.com", tipo: "E-mail", titular: "Ana Lúcia S." },
    apadrinhamento: [20, 50, 100],
    feed: [
      {
        id: "a1",
        data: "30/08/2026",
        tag: "Atualização",
        texto:
          "O Tobias já está com todas as vacinas em dia e aprendeu a andar de coleira. Está pronto para adoção!",
        foto: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
      },
      {
        id: "a2",
        data: "18/08/2026",
        tag: "Final Feliz",
        texto: "A Pipoca foi adotada por uma família de Águas Claras. Já mandaram foto da primeira noite em casa!",
      },
    ],
  },
  {
    id: "lar-felino-df",
    nome: "ONG Lar Felino DF",
    tipo: "ONG",
    avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80",
    missao:
      "Dedicados exclusivamente a gatos: resgate, tratamento de FIV/FeLV, telagem de janelas e adoção responsável em todo o Distrito Federal.",
    cidade: "Sobradinho - DF",
    redes: [
      { rede: "Instagram", url: "https://instagram.com" },
      { rede: "TikTok", url: "https://tiktok.com" },
    ],
    estatisticas: { resgatados: 233, adocoes: 190, campanhas: 1 },
    pix: { chave: "98.765.432/0001-10", tipo: "CNPJ", titular: "Lar Felino DF" },
    banco: { banco: "Caixa Econômica (104)", agencia: "1234", conta: "00098-7" },
    apadrinhamento: [25, 50, 90],
    feed: [
      {
        id: "l1",
        data: "26/08/2026",
        tag: "Resgate",
        texto: "Colônia de 12 gatos resgatada em Planaltina. Todos passaram por triagem veterinária nesta semana.",
        foto: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&q=80",
      },
    ],
  },
  {
    id: "rafael-m",
    nome: "Protetor Rafael M.",
    tipo: "Protetor Independente",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    missao: "Resgato gatos em situação de rua em Águas Claras e mantenho lar temporário para até 8 felinos.",
    cidade: "Águas Claras - DF",
    redes: [{ rede: "Instagram", url: "https://instagram.com" }],
    estatisticas: { resgatados: 58, adocoes: 41, campanhas: 1 },
    pix: { chave: "(61) 99876-5432", tipo: "Celular", titular: "Rafael M." },
    apadrinhamento: [20, 40, 80],
    feed: [
      {
        id: "r1",
        data: "22/08/2026",
        tag: "Atualização",
        texto: "A Amora está socializando muito bem com os outros gatos do lar temporário.",
        foto: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80",
      },
    ],
  },
  {
    id: "amigos-quatro-patas",
    nome: "ONG Amigos de Quatro Patas",
    tipo: "ONG",
    avatar: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=80",
    missao: "Abrigo comunitário em Ceilândia com foco em cães de grande porte e reabilitação de animais atropelados.",
    cidade: "Ceilândia - DF",
    redes: [{ rede: "Instagram", url: "https://instagram.com" }],
    estatisticas: { resgatados: 305, adocoes: 210, campanhas: 1 },
    pix: { chave: "11.222.333/0001-44", tipo: "CNPJ", titular: "Amigos de Quatro Patas" },
    banco: { banco: "Itaú (341)", agencia: "0552", conta: "44321-0" },
    apadrinhamento: [30, 70, 150],
    feed: [
      {
        id: "q1",
        data: "19/08/2026",
        tag: "Resgate",
        texto: "Bidu chegou até nós após ser encontrado na EPTG. Já recuperado, aguarda adoção.",
        foto: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
      },
    ],
  },
  {
    id: "claudia-s",
    nome: "Protetora Cláudia S.",
    tipo: "Protetor Independente",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    missao: "Cuido de filhotes de gatos resgatados no Gama até que tenham idade para castração e adoção.",
    cidade: "Gama - DF",
    redes: [{ rede: "Instagram", url: "https://instagram.com" }],
    estatisticas: { resgatados: 47, adocoes: 33, campanhas: 1 },
    pix: { chave: "123.456.789-00", tipo: "CPF", titular: "Cláudia S." },
    apadrinhamento: [15, 35, 70],
    feed: [
      {
        id: "c1",
        data: "15/08/2026",
        tag: "Atualização",
        texto: "Simba tomou a primeira dose da vacina múltipla felina hoje.",
        foto: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&q=80",
      },
    ],
  },
];

export function doadorPorNome(nome: string): Doador | undefined {
  return doadores.find((d) => d.nome === nome);
}
