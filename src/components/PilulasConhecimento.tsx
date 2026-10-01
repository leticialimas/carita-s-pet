const pilulas = [
  {
    icone: "🪟",
    titulo: "Telas de proteção",
    texto: "Janelas e varandas teladas evitam quedas — obrigatório para gatos em apartamento.",
  },
  {
    icone: "🐈",
    titulo: "Caixa de areia",
    texto: "Uma caixa por gato + uma extra, em local calmo, longe da comida e da água.",
  },
  {
    icone: "💉",
    titulo: "Vacinação básica",
    texto: "Filhotes: V8/V10 ou V4 a partir de 45 dias, em 3 doses. Antirrábica a partir dos 4 meses.",
  },
  {
    icone: "🏠",
    titulo: "Adaptação nos primeiros dias",
    texto: "Reserve um cômodo tranquilo. Apresente a casa aos poucos e mantenha a rotina.",
  },
  {
    icone: "🦴",
    titulo: "Castração",
    texto: "Previne doenças, fugas e ninhadas indesejadas. Todos os pets da plataforma são castrados.",
  },
  {
    icone: "🏷️",
    titulo: "Identificação",
    texto: "Coleira com plaquinha e microchip: a forma mais rápida de reencontrar um pet perdido.",
  },
];

export function PilulasConhecimento() {
  return (
    <section aria-labelledby="pilulas" className="mt-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="pilulas" className="text-xl font-bold text-foreground">
          Pílulas de Posse Responsável
        </h2>
        <p className="text-xs text-muted-foreground">Deslize para ver mais →</p>
      </div>
      <ul className="-mx-4 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin]">
        {pilulas.map((p) => (
          <li
            key={p.titulo}
            className="surface-vintage w-64 shrink-0 snap-start p-4 sm:w-72"
          >
            <span aria-hidden className="text-2xl">
              {p.icone}
            </span>
            <h3 className="mt-2 text-base font-semibold text-primary">{p.titulo}</h3>
            <p className="mt-1 text-sm text-foreground">{p.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
