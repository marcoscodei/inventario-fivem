import React, { useState } from 'react';
import type { Item, ItemCategory } from '../types/inventory';
import { InventorySlot } from './InventorySlot';

interface GridProps {
  totalSlots?: number;
  items: Record<number, Item>;
  selectedSlot: number | null;
  hotbar: Record<number, number>;
  onSelectSlot: (slot: number) => void;
  onContextMenu: (e: React.MouseEvent, slot: number) => void;
  onUnequipAll?: () => void;
  onDragStart: (e: React.DragEvent, slot: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetSlot: number) => void;
}

const CATEGORY_FILTERS: { key: ItemCategory | 'all'; icon: string; label: string }[] = [
  { key: 'all', icon: '📋', label: 'Tudo' },
  { key: 'medical', icon: '🩹', label: 'Médico' },
  { key: 'food', icon: '🍔', label: 'Comida' },
  { key: 'weapon', icon: '🔫', label: 'Armas' },
  { key: 'tool', icon: '🛠️', label: 'Ferramentas' },
];

export const InventoryGrid: React.FC<GridProps> = ({
  totalSlots = 30,
  items,
  selectedSlot,
  hotbar,
  onSelectSlot,
  onContextMenu,
  onUnequipAll,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'all'>('all');
  const slots = Array.from({ length: totalSlots }, (_, i) => i + 1);

  const slotToHotkey: Record<number, number> = {};
  Object.entries(hotbar).forEach(([key, slot]) => {
    slotToHotkey[slot] = Number(key);
  });

  const isVisible = (slotIndex: number) => {
    const item = items[slotIndex];
    if (!item) return true;
    if (search.trim() && !item.label.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    return true;
  };

  return (
    <div className="w-[580px] bg-[#050508]/90 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col gap-4 select-none">
      <div className="flex items-center gap-2.5">
        <div className="flex-1 flex items-center gap-2 bg-[#0c0c12] border border-white/5 rounded-2xl px-3.5 py-2.5 focus-within:border-red-500/50 transition-all shadow-inner">
          <span className="text-neutral-500 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar na mochila..."
            className="flex-1 bg-transparent outline-none text-xs text-neutral-200 placeholder:text-neutral-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#0c0c12] p-1 rounded-2xl border border-white/5">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.key}
              title={f.label}
              onClick={() => setCategoryFilter(f.key)}
              className={`px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                categoryFilter === f.key
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {f.icon}
            </button>
          ))}
        </div>

        <button
          onClick={onUnequipAll}
          className="text-[10px] bg-red-600 hover:bg-red-500 text-white px-3.5 py-2.5 rounded-2xl font-black tracking-widest transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
        >
          DESEQUIPAR
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2.5 max-h-[460px] overflow-y-auto pr-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-red-600/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-black/50">
        {slots.map((slotIndex) =>
          isVisible(slotIndex) ? (
            <InventorySlot
              key={slotIndex}
              slotIndex={slotIndex}
              item={items[slotIndex]}
              isSelected={selectedSlot === slotIndex}
              hotkeyNumber={slotToHotkey[slotIndex]}
              onClick={onSelectSlot}
              onContextMenu={onContextMenu}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ) : (
            <div key={slotIndex} className="h-28 rounded-2xl bg-black/10 border border-white/[0.02]" />
          )
        )}
      </div>
    </div>
  );
};