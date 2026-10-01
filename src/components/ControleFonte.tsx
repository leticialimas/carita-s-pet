import { useEffect, useState } from "react";
import { aplicarNivelFonte, escalaFonte, lerNivelFonte } from "@/lib/favoritos";

export function ControleFonte() {
  const [nivel, setNivel] = useState(0);

  useEffect(() => {
    setNivel(aplicarNivelFonte(lerNivelFonte()));
  }, []);

  const mudar = (delta: number) => setNivel(aplicarNivelFonte(nivel + delta));

  return (
    <div
      role="group"
      aria-label="Tamanho do texto"
      className="flex items-center overflow-hidden rounded-md border border-input bg-card text-xs"
    >
      <button
        type="button"
        onClick={() => mudar(-1)}
        disabled={nivel === 0}
        aria-label="Diminuir texto"
        className="px-2 py-1.5 text-foreground hover:bg-accent disabled:opacity-40"
      >
        A-
      </button>
      <span className="border-x border-input px-1.5 py-1.5 text-muted-foreground" aria-live="polite">
        {escalaFonte[nivel]}%
      </span>
      <button
        type="button"
        onClick={() => mudar(1)}
        disabled={nivel === escalaFonte.length - 1}
        aria-label="Aumentar texto"
        className="px-2 py-1.5 text-foreground hover:bg-accent disabled:opacity-40"
      >
        A+
      </button>
    </div>
  );
}
