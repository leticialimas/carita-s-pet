import { Heart } from "lucide-react";
import { alternarFavorito, useFavoritos } from "@/lib/favoritos";

export function BotaoFavorito({ petId, nome }: { petId: string; nome: string }) {
  const favoritos = useFavoritos();
  const ativo = favoritos.includes(petId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        alternarFavorito(petId);
      }}
      aria-pressed={ativo}
      aria-label={ativo ? `Remover ${nome} dos favoritos` : `Salvar ${nome} nos favoritos`}
      title={ativo ? "Remover dos favoritos" : "Salvar nos favoritos"}
      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/90 shadow transition-transform hover:scale-110"
    >
      <Heart
        size={18}
        strokeWidth={1.5}
        className={ativo ? "fill-secondary text-primary" : "text-primary"}
      />
    </button>
  );
}
