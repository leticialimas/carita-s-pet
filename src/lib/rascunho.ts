import { useCallback, useEffect, useRef, useState } from "react";

export type RascunhoSalvo<T> = {
  chave: string;
  rotulo: string;
  dados: T;
  atualizadoEm: number;
};

const PREFIXO = "caritas-pets-rascunho:";

export function salvarRascunho<T>(chave: string, rotulo: string, dados: T) {
  try {
    const registro: RascunhoSalvo<T> = { chave, rotulo, dados, atualizadoEm: Date.now() };
    localStorage.setItem(PREFIXO + chave, JSON.stringify(registro));
    return registro.atualizadoEm;
  } catch {
    return null;
  }
}

export function lerRascunho<T>(chave: string): RascunhoSalvo<T> | null {
  try {
    const raw = localStorage.getItem(PREFIXO + chave);
    return raw ? (JSON.parse(raw) as RascunhoSalvo<T>) : null;
  } catch {
    return null;
  }
}

export function limparRascunho(chave: string) {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch {
    /* ignora */
  }
}

export function listarRascunhos(): RascunhoSalvo<unknown>[] {
  const itens: RascunhoSalvo<unknown>[] = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (!k?.startsWith(PREFIXO)) continue;
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      itens.push(JSON.parse(raw) as RascunhoSalvo<unknown>);
    }
  } catch {
    /* ignora */
  }
  return itens.sort((a, b) => b.atualizadoEm - a.atualizadoEm);
}

export function tempoRelativo(ts: number): string {
  const seg = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (seg < 10) return "agora mesmo";
  if (seg < 60) return `há ${seg} segundos`;
  const min = Math.round(seg / 60);
  if (min < 60) return `há ${min} minuto${min > 1 ? "s" : ""}`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} hora${h > 1 ? "s" : ""}`;
  const d = Math.round(h / 24);
  return `há ${d} dia${d > 1 ? "s" : ""}`;
}

/**
 * Salva o formulário automaticamente (com pequeno atraso) sempre que os dados mudam
 * e devolve o texto "Última alteração salva há X" já formatado.
 */
export function useAutoSave<T>(chave: string, rotulo: string, dados: T, ativo = true) {
  const [salvoEm, setSalvoEm] = useState<number | null>(null);
  const [, forcar] = useState(0);
  const primeiro = useRef(true);

  useEffect(() => {
    if (!ativo) return;
    if (primeiro.current) {
      primeiro.current = false;
      return;
    }
    const t = setTimeout(() => {
      const ts = salvarRascunho(chave, rotulo, dados);
      if (ts) setSalvoEm(ts);
    }, 600);
    return () => clearTimeout(t);
  }, [chave, rotulo, dados, ativo]);

  useEffect(() => {
    const i = setInterval(() => forcar((n) => n + 1), 20000);
    return () => clearInterval(i);
  }, []);

  const salvarAgora = useCallback(() => {
    const ts = salvarRascunho(chave, rotulo, dados);
    if (ts) setSalvoEm(ts);
  }, [chave, rotulo, dados]);

  const descartar = useCallback(() => {
    limparRascunho(chave);
    setSalvoEm(null);
  }, [chave]);

  return {
    salvoEm,
    texto: salvoEm ? `Última alteração salva ${tempoRelativo(salvoEm)}` : null,
    salvarAgora,
    descartar,
  };
}
