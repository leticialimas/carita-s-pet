export type PetAtual = {
  id: string;
  nome: string;
  especie: string;
  foto: string;
  sociavel: boolean;
  vacinado: boolean;
  castrado: boolean;
};

export type Adotante = {
  nome: string;
  email: string;
  cidade: string;
  comprovante: string;
  fotoPerfil?: string;
  bio?: string;
  galeriaLar?: string[];
  petsAtuais?: PetAtual[];
};

const KEY = "caritas-pets-adotante";

export function salvarAdotante(a: Adotante) {
  localStorage.setItem(KEY, JSON.stringify(a));
}

export function lerAdotante(): Adotante | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Adotante) : null;
  } catch {
    return null;
  }
}

export function arquivoParaDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
    reader.readAsDataURL(file);
  });
}
