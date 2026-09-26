import React from 'react';
import type { Item } from '../types/inventory';
import { ItemIcon } from './icons';

interface HotbarProps {
  /** Mapa: número do atalho (1-5) -> índice do slot da mochila vinculado */
  hotbar: Record<number, number>;
  items: Record<number, Item>;
  onUseHotkey: (key: number) => void;
}

export const Hotbar: React.FC<HotbarProps> = ({ hotbar, items, onUseHotkey }) => {
  const keys = [1, 2, 3, 4, 5];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 bg-[#050508]/90 backdrop-blur-2xl p-2.5 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.9)] select-none z-20">
      {keys.map((key) => {
        const slot = hotbar[key];
        const item = slot ? items[slot] : undefined;

        return (
          <button
            key={key}
            onClick={() => item && onUseHotkey(key)}
            title={item ? item.label : 'Atalho vazio'}
            className={`relative w-16 h-16 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
              item
                ? 'bg-[#0c0c12] border-white/10 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'bg-black/20 border-white/5 cursor-default'
            }`}
          >
            <span className="absolute top-1 left-1.5 text-[9px] font-mono font-bold text-neutral-500">
              {key}
            </span>

            {item ? (
              <>
                <ItemIcon name={item.name} className="w-4 h-4 text-neutral-100" />
                <span className="text-[8px] font-mono font-bold text-neutral-400">
                  x{item.amount.toLocaleString('pt-BR')}
                </span>
              </>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-800/60" />
            )}
          </button>
        );
      })}
    </div>
  );
};