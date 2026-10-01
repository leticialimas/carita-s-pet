export type ConfigBot = {
  ativo: boolean;
  saudacao: string;
  perguntas: string[];
  respostasRapidas: string[];
};

const KEY = "caritas-pets-bot";

export const configBotPadrao: ConfigBot = {
  ativo: true,
  saudacao:
    "Olá! Vi que você se interessou por {pet}. Antes de conversarmos, vou te enviar a ficha dele(a) e algumas perguntinhas rápidas.",
  perguntas: [
    "Sua casa possui muros altos ou quintal seguro?",
    "Mora em apartamento com telas de proteção nas janelas e varandas?",
    "Quantas horas por dia o pet ficaria sozinho em casa?",
  ],
  respostasRapidas: [
    "Posso agendar uma visita virtual?",
    "Ele(a) convive bem com outros animais?",
    "Quais são os custos mensais estimados?",
  ],
};

export function lerConfigBot(): ConfigBot {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return configBotPadrao;
    return { ...configBotPadrao, ...(JSON.parse(raw) as Partial<ConfigBot>) };
  } catch {
    return configBotPadrao;
  }
}

export function salvarConfigBot(c: ConfigBot) {
  localStorage.setItem(KEY, JSON.stringify(c));
}
