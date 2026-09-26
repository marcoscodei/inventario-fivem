import React from 'react';
import { createPortal } from 'react-dom';
import type { Item } from '../types/inventory';

interface TooltipProps {
  item: Item;
  /** Retângulo (em coordenadas de viewport) do slot que disparou o tooltip */
  anchorRect: { top: number; left: number; width: number; bottom: number };
}

const categoryLabel: Record<Item['category'], string> = {
  food: 'Comida / Bebida',
  weapon: 'Munição / Arma',
  medical: 'Médico',
  key: 'Chave',
  tool: 'Ferramenta',
  other: 'Diversos',
};

const TOOLTIP_WIDTH = 192; // equivalente ao w-48 (12rem)
const GAP = 8;

export const Tooltip: React.FC<TooltipProps> = ({ item, anchorRect }) => {
  // Se não houver espaço suficiente acima (perto do topo da tela / do
  // contêiner com scroll), mostra o tooltip abaixo do slot em vez de acima.
  const showBelow = anchorRect.top < 160;

  const left = anchorRect.left + anchorRect.width / 2;
  const top = showBelow ? anchorRect.bottom + GAP : anchorRect.top - GAP;

  // Renderiza direto no <body> via portal: assim o tooltip nunca é cortado
  // por um ancestral com overflow-hidden/overflow-y-auto (como a grade da
  // mochila), e sempre fica por cima de tudo (z-index altíssimo).
  return createPortal(
    <div
      style={{
        position: 'fixed',
        left,
        top,
        width: TOOLTIP_WIDTH,
        transform: showBelow ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
      }}
      className="bg-[#0a0a0f] border border-red-500/30 rounded-xl p-3 shadow-[0_0_25px_rgba(0,0,0,0.9)] z-[9999] pointer-events-none animate-[fadeIn_0.15s_ease]"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-white">{item.label}</span>
        <span className="text-[9px] font-mono text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-500/20">
          {categoryLabel[item.category]}
        </span>
      </div>
      {item.description && (
        <p className="text-[10px] text-neutral-400 leading-snug">{item.description}</p>
      )}
      <div className="flex justify-between mt-2 pt-2 border-t border-white/5 text-[9px] font-mono text-neutral-500">
        <span>Peso: {item.weight.toFixed(2)}kg / un.</span>
        <span>Total: {(item.weight * item.amount).toFixed(2)}kg</span>
      </div>
      {item.durability !== undefined && (
        <div className="mt-1 text-[9px] font-mono text-neutral-500">
          Durabilidade: {item.durability}%
        </div>
      )}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0a0a0f] rotate-45 ${
          showBelow
            ? 'bottom-full -mb-1 border-l border-t border-red-500/30'
            : 'top-full -mt-1 border-r border-b border-red-500/30'
        }`}
      />
    </div>,
    document.body
  );
};