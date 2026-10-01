export type Desaparecido = {
  id: string;
  nome: string;
  especie: "cao" | "gato";
  racaCor: string;
  regiao: string;
  localVisto: string;
  data: string;
  caracteristicas: string;
  telefone: string;
  tutor: string;
  foto: string;
};

export const desaparecidosIniciais: Desaparecido[] = [
  {
    id: "bolinha",
    nome: "Bolinha",
    especie: "cao",
    racaCor: "SRD caramelo",
    regiao: "Águas Claras - DF",
    localVisto: "Parque Águas Claras, próximo à Av. das Araucárias",
    data: "29/08/2026",
    caracteristicas: "Coleira vermelha, orelha esquerda dobrada, muito medroso.",
    tutor: "Juliana",
    telefone: "5561999990001",
    foto: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80",
  },
  {
    id: "mingau",
    nome: "Mingau",
    especie: "gato",
    racaCor: "Branco e cinza, pelo curto",
    regiao: "Cruzeiro - DF",
    localVisto: "Quadra comercial do Cruzeiro Velho",
    data: "01/09/2026",
    caracteristicas: "Rabo listrado, castrado, sem coleira. Atende pelo nome.",
    tutor: "Paulo",
    telefone: "5561999990002",
    foto: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
  },
  {
    id: "luna",
    nome: "Luna",
    especie: "cao",
    racaCor: "Preta, porte médio",
    regiao: "Taguatinga - DF",
    localVisto: "Praça do Relógio, Taguatinga Centro",
    data: "24/08/2026",
    caracteristicas: "Mancha branca no peito, usa peitoral azul.",
    tutor: "Marcos",
    telefone: "5561999990003",
    foto: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
  },
];

const KEY = "caritas-pets-desaparecidos";

export function lerDesaparecidos(): Desaparecido[] {
  try {
    const raw = localStorage.getItem(KEY);
    const extras = raw ? (JSON.parse(raw) as Desaparecido[]) : [];
    return [...extras, ...desaparecidosIniciais];
  } catch {
    return desaparecidosIniciais;
  }
}

export function salvarDesaparecido(d: Desaparecido) {
  try {
    const raw = localStorage.getItem(KEY);
    const extras = raw ? (JSON.parse(raw) as Desaparecido[]) : [];
    localStorage.setItem(KEY, JSON.stringify([d, ...extras]));
  } catch {
    localStorage.setItem(KEY, JSON.stringify([d]));
  }
}
