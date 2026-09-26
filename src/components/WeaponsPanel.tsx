import React, { useState } from 'react';
import type { Weapon } from '../types/inventory';
import { WeaponIcon } from './icons';

interface WeaponsProps {
  weapons: Weapon[];
  onDragStartWeapon: (e: React.DragEvent, weaponId: string) => void;
  onDropWeaponFromInventory: (e: React.DragEvent) => void;
  onContextMenu?: (e: React.MouseEvent, weaponId: string) => void;
}

export const WeaponsPanel: React.FC<WeaponsProps> = ({
  weapons,
  onDragStartWeapon,
  onDropWeaponFromInventory,
  onContextMenu,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDropWeaponFromInventory(e);
      }}
      className={`w-64 bg-[#050508]/90 backdrop-blur-2xl p-5 rounded-3xl border shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col gap-4 select-none transition-colors ${
        isDragOver ? 'border-red-400' : 'border-white/10'
      }`}
    >
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <span className="text-xs font-black tracking-widest text-red-500 uppercase">
          Armas Equipadas
        </span>
        <span className="text-[10px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded-md">
          {weapons.length} / 4
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {weapons.map((w) => (
          <div
            key={w.id}
            draggable
            onDragStart={(e) => onDragStartWeapon(e, w.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              onContextMenu?.(e, w.id);
            }}
            className="h-32 bg-[#0c0c12] border border-white/5 hover:border-red-500/50 rounded-2xl p-3 flex flex-col justify-between relative group transition-all shadow-md cursor-grab active:cursor-grabbing hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-200 group-hover:text-red-400 transition-colors">
                {w.label}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Equipada</span>
            </div>

            <div className="flex-1 flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform">
              <WeaponIcon className="w-[26px] h-[26px] text-red-400" />
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[10px] font-mono gap-2">
              <span className="text-neutral-500 truncate max-w-[100px]" title={w.name}>
                {w.name}
              </span>
              <div className="flex flex-col items-center bg-red-950/40 border border-red-500/30 px-2 py-1 rounded-xl shrink-0">
                <span className="font-bold text-red-500 text-[10px] leading-none">x {w.ammo}</span>
                <span className="text-[8px] font-black text-red-400/80 uppercase tracking-tight leading-tight mt-0.5">
                  Munição
                </span>
              </div>
            </div>

            {w.durability !== undefined && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
                <div
                  className={`h-full ${
                    w.durability > 50 ? 'bg-emerald-500' : w.durability > 20 ? 'bg-amber-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${w.durability}%` }}
                />
              </div>
            )}
          </div>
        ))}

        {weapons.length === 0 && (
          <div
            className={`h-40 border border-dashed rounded-2xl flex flex-col items-center justify-center text-xs text-center p-4 transition-colors ${
              isDragOver ? 'border-red-400 text-red-300' : 'border-white/10 text-neutral-600'
            }`}
          >
            <span>Nenhuma arma equipada.</span>
            <span className="text-[10px] text-neutral-700 mt-1">
              Arraste um item de arma da mochila para aqui.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};