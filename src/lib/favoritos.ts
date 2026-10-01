import { useEffect, useState } from "react";

const KEY_FAV = "caritas-pets-favoritos";
const KEY_ALERTAS = "caritas-pets-alertas";
const KEY_FONTE = "caritas-pets-fonte";
const EVT = "caritas:favoritos";

function ler<T>(key: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(key: string, valor: unknown) {
  localStorage.setItem(key, JSON.stringify(valor));
  window.dispatchEvent(new Event(EVT));
}

export function lerFavoritos(): string[] {
  return ler<string[]>(KEY_FAV, []);
}

export function alternarFavorito(id: string) {
  const atual = lerFavoritos();
  const novo = atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id];
  gravar(KEY_FAV, novo);
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setFavoritos(lerFavoritos());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return favoritos;
}

export type AlertaPet = {
  id: string;
  criadoEm: string;
  criterios: Record<string, string>;
};

export function lerAlertas(): AlertaPet[] {
  return ler<AlertaPet[]>(KEY_ALERTAS, []);
}

export function salvarAlerta(criterios: Record<string, string>) {
  const novo: AlertaPet = {
    id: `alerta-${Date.now()}`,
    criadoEm: new Date().toLocaleDateString("pt-BR"),
    criterios,
  };
  gravar(KEY_ALERTAS, [...lerAlertas(), novo]);
  return novo;
}

export function removerAlerta(id: string) {
  gravar(
    KEY_ALERTAS,
    lerAlertas().filter((a) => a.id !== id),
  );
}

export function useAlertas() {
  const [alertas, setAlertas] = useState<AlertaPet[]>([]);
  useEffect(() => {
    const sync = () => setAlertas(lerAlertas());
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  return alertas;
}

/** Tamanho de fonte: índice na escala (0 = padrão). */
export const escalaFonte = [100, 112, 125, 140] as const;

export function lerNivelFonte(): number {
  return ler<number>(KEY_FONTE, 0);
}

export function aplicarNivelFonte(nivel: number) {
  const n = Math.min(Math.max(nivel, 0), escalaFonte.length - 1);
  document.documentElement.style.fontSize = `${escalaFonte[n]}%`;
  localStorage.setItem(KEY_FONTE, JSON.stringify(n));
  return n;
}
