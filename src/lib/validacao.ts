export function somenteDigitos(v: string) {
  return v.replace(/\D/g, "");
}

export function mascaraCPF(v: string) {
  const d = somenteDigitos(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function mascaraCNPJ(v: string) {
  const d = somenteDigitos(v).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function mascaraCEP(v: string) {
  const d = somenteDigitos(v).slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, "$1-$2");
}

export function mascaraTelefone(v: string) {
  const d = somenteDigitos(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export function cpfValido(v: string) {
  const c = somenteDigitos(v);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const calc = (fim: number) => {
    let soma = 0;
    for (let i = 0; i < fim; i++) soma += Number(c[i]) * (fim + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(c[9]) && calc(10) === Number(c[10]);
}

export function cnpjValido(v: string) {
  const c = somenteDigitos(v);
  if (c.length !== 14 || /^(\d)\1{13}$/.test(c)) return false;
  const calc = (fim: number) => {
    const pesos = fim === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < fim; i++) soma += Number(c[i]) * pesos[i]!;
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === Number(c[12]) && calc(13) === Number(c[13]);
}

export function emailValido(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

/** Base simplificada de CEPs do DF e entorno (plataforma restrita a Brasília - DF). */
const cepsDF: Record<string, { logradouro: string; bairro: string; cidade: string; uf: string }> = {
  "70000": { logradouro: "Esplanada dos Ministérios", bairro: "Zona Cívico-Administrativa", cidade: "Brasília", uf: "DF" },
  "70200": { logradouro: "SQS 200", bairro: "Asa Sul", cidade: "Brasília", uf: "DF" },
  "70700": { logradouro: "SQN 100", bairro: "Asa Norte", cidade: "Brasília", uf: "DF" },
  "71900": { logradouro: "Avenida das Araucárias", bairro: "Águas Claras", cidade: "Brasília", uf: "DF" },
  "72000": { logradouro: "QNL 10", bairro: "Taguatinga", cidade: "Taguatinga", uf: "DF" },
  "72200": { logradouro: "QNN 20", bairro: "Ceilândia", cidade: "Ceilândia", uf: "DF" },
  "72400": { logradouro: "Quadra 20", bairro: "Setor Central", cidade: "Gama", uf: "DF" },
  "73000": { logradouro: "Quadra 5", bairro: "Setor Central", cidade: "Sobradinho", uf: "DF" },
  "74000": { logradouro: "Rua do Entorno", bairro: "Centro", cidade: "Valparaíso de Goiás", uf: "GO" },
};

export type EnderecoCEP = { logradouro: string; bairro: string; cidade: string; uf: string };

/** Retorna endereço quando o CEP pertence ao DF/entorno atendido, senão null. */
export function buscarCEP(cep: string): EnderecoCEP | null {
  const d = somenteDigitos(cep);
  if (d.length !== 8) return null;
  const prefixo = d.slice(0, 5);
  if (cepsDF[prefixo]) return cepsDF[prefixo]!;
  const faixa = Number(prefixo);
  if (faixa >= 70000 && faixa <= 73699) {
    return { logradouro: "Endereço em Brasília", bairro: "Região Administrativa", cidade: "Brasília", uf: "DF" };
  }
  return null;
}
