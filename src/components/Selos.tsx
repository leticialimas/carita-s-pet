import type { Doador } from "@/data/doadores";

type Selo = { texto: string; tom: "primario" | "rosa" | "amarelo" };

export function selosDoDoador(d: Pick<Doador, "tipo" | "estatisticas">): Selo[] {
  const selos: Selo[] = [{ texto: "Identidade Verificada", tom: "primario" }];
  if (d.tipo === "ONG") selos.push({ texto: "ONG Ativa", tom: "rosa" });
  else selos.push({ texto: "Resgatista Independente", tom: "rosa" });
  if (d.estatisticas.adocoes >= 50) selos.push({ texto: "Lares Formados", tom: "amarelo" });
  return selos;
}

const tons = {
  primario: "border-primary text-primary",
  rosa: "border-secondary-foreground/60 text-secondary-foreground bg-secondary/40",
  amarelo: "border-accent-foreground/60 text-accent-foreground bg-accent/60",
};

export function Selos({
  doador,
  compacto = false,
}: {
  doador: Pick<Doador, "tipo" | "estatisticas">;
  compacto?: boolean;
}) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Selos de confiança">
      {selosDoDoador(doador).map((s) => (
        <li
          key={s.texto}
          className={`selo-carimbo ${tons[s.tom]} ${compacto ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}
        >
          ✓ {s.texto}
        </li>
      ))}
    </ul>
  );
}
