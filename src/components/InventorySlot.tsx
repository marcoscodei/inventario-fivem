import React, { useState, useRef } from 'react';
import type { Item } from '../types/inventory';
import { Tooltip } from './Tooltip';
import { ItemIcon } from './icons';

interface SlotProps {
  slotIndex: number;
  item?: Item;
  isSelected: boolean;
  hotkeyNumber?: number;
  onClick: (slot: number) => void;
  onContextMenu: (e: React.MouseEvent, slot: number) => void;
  onDragStart: (e: React.DragEvent, slot: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetSlot: number) => void;
}

export const InventorySlot: React.FC<SlotProps> = ({
  slotIndex,
  item,
  isSelected,
  hotkeyNumber,
  onClick,
  onContextMenu,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipRect, setTooltipRect] = useState<{
    top: number;
    left: number;
    width: number;
    bottom: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!item) return;
    setShowTooltip(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipRect({ top: rect.top, left: rect.left, width: rect.width, bottom: rect.bottom });
    }
  };

  return (
    <div
      ref={containerRef}
      draggable={!!item}
      onDragStart={(e) => {
        setShowTooltip(false);
        onDragStart(e, slotIndex);
      }}
      onDragOver={(e) => {
        onDragOver(e);
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e, slotIndex);
      }}
      onClick={() => onClick(slotIndex)}
      onContextMenu={(e) => onContextMenu(e, slotIndex)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowTooltip(false)}
      className={`relative h-28 rounded-2xl border transition-all duration-200 select-none cursor-pointer flex flex-col justify-between p-2 backdrop-blur-xl overflow-visible group ${
        isSelected
          ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-[1.02]'
          : isDragOver
            ? 'bg-red-950/30 border-red-400 scale-[1.03]'
            : 'bg-[#09090c]/90 hover:bg-[#121218] border-white/5 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]'
      }`}
    >
      {item && showTooltip && tooltipRect && <Tooltip item={item} anchorRect={tooltipRect} />}

      <div className="flex justify-between items-center text-[10px] font-mono font-semibold text-neutral-500 z-10">
        <span className="flex items-center gap-1">
          #{slotIndex.toString().padStart(2, '0')}
          {hotkeyNumber && (
            <span className="bg-red-600 text-white font-bold px-1 rounded text-[8px]">
              [{hotkeyNumber}]
            </span>
          )}
        </span>
        {item && (
          <span className="text-neutral-300 font-bold bg-black/70 px-1.5 py-0.5 rounded-md border border-white/10 text-[9px]">
            x{item.amount.toLocaleString('pt-BR')}
          </span>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center my-0.5 z-10">
        {item ? (
          <ItemIcon
            name={item.name}
            className="w-[22px] h-[22px] text-neutral-100 transform group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-800/60" />
        )}
      </div>

      {item ? (
        <div className="z-10 w-full flex flex-col gap-1">
          {item.durability !== undefined && (
            <div className="w-full bg-black/60 h-1 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full transition-all ${
                  item.durability > 50
                    ? 'bg-emerald-500'
                    : item.durability > 20
                      ? 'bg-amber-500'
                      : 'bg-red-600'
                }`}
                style={{ width: `${item.durability}%` }}
              />
            </div>
          )}
          <div className="w-full bg-red-600 group-hover:bg-red-500 text-white text-[9px] font-black uppercase text-center py-1 px-1 rounded-xl tracking-wider truncate shadow-md transition-colors leading-tight">
            {item.label}
          </div>
        </div>
      ) : (
        <div className="h-4" />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
    </div>
  );
};