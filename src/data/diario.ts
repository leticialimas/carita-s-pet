export type PostDiario = {
  id: string;
  tipo: "foto" | "video";
  midia: string;
  legenda: string;
  data: string;
};

export type DiarioPet = {
  id: string;
  pet: string;
  adotante: string;
  doador: string;
  avatar: string;
  desde: string;
  posts: PostDiario[];
};

// Fotografias de domínio público / licença livre (Unsplash).
export const diarios: DiarioPet[] = [
  {
    id: "mel",
    pet: "Mel",
    adotante: "Família Souza",
    doador: "ONG Patinhas do Cerrado",
    avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&q=80",
    desde: "Adotada em março de 2026",
    posts: [
      {
        id: "mel-1",
        tipo: "foto",
        midia: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80",
        legenda: "Primeiro fim de semana no Parque da Cidade.",
        data: "12 de agosto",
      },
      {
        id: "mel-2",
        tipo: "foto",
        midia: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80",
        legenda: "Aprendeu a dar a patinha em duas semanas!",
        data: "27 de agosto",
      },
    ],
  },
  {
    id: "tobias",
    pet: "Tobias",
    adotante: "Marcos e Rita",
    doador: "Protetora Ana Lúcia",
    avatar: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&q=80",
    desde: "Adotado em janeiro de 2026",
    posts: [
      {
        id: "tobias-1",
        tipo: "foto",
        midia: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
        legenda: "Primeira consulta de rotina: tudo certo.",
        data: "3 de setembro",
      },
    ],
  },
  {
    id: "nina",
    pet: "Nina",
    adotante: "Camila R.",
    doador: "ONG Amigos de Quatro Patas",
    avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=80",
    desde: "Adotada em novembro de 2025",
    posts: [
      {
        id: "nina-1",
        tipo: "foto",
        midia: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&q=80",
        legenda: "Telas de proteção instaladas em todas as janelas.",
        data: "1º de setembro",
      },
      {
        id: "nina-2",
        tipo: "foto",
        midia: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=80",
        legenda: "Caixa de areia nova, aprovada pela chefe.",
        data: "6 de setembro",
      },
    ],
  },
  {
    id: "pipoca",
    pet: "Pipoca",
    adotante: "Seu Antônio",
    doador: "Protetor Rafael Dias",
    avatar: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&q=80",
    desde: "Adotada em junho de 2026",
    posts: [
      {
        id: "pipoca-1",
        tipo: "foto",
        midia: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&q=80",
        legenda: "Soneca da tarde no sofá de sempre.",
        data: "8 de setembro",
      },
    ],
  },
];
