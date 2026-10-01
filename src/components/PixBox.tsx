import { useState } from "react";

type Props = {
  chave: string;
  tipo: string;
  titular: string;
  banco?: { banco: string; agencia: string; conta: string } | undefined;
};

export function PixBox({ chave, tipo, titular, banco }: Props) {
  const [copiado, setCopiado] = useState(false);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(chave)}`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(chave);
    } catch {
      /* clipboard indisponível */
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  return (
    <div className="surface-vintage grid gap-6 p-6 sm:grid-cols-[220px_1fr] sm:items-center">
      <img
        src={qr}
        alt={`QR Code PIX de ${titular}`}
        loading="lazy"
        width={220}
        height={220}
        className="mx-auto rounded-md bg-card p-2"
      />
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-primary">PIX Copia e Cola</h3>
        <p className="text-sm text-muted-foreground">
          Titular: <strong className="text-foreground">{titular}</strong> · Tipo de chave: {tipo}
        </p>
        <p className="rounded-md border border-input bg-background px-3 py-2 font-mono text-sm break-all text-foreground">
          {chave}
        </p>
        <button
          onClick={copiar}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {copiado ? "Chave copiada!" : "Copiar Chave PIX"}
        </button>
        {banco && (
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Dados bancários:</strong> {banco.banco} · Agência{" "}
            {banco.agencia} · Conta corrente {banco.conta}
          </p>
        )}
      </div>
    </div>
  );
}
