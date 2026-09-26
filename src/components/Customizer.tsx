import React from 'react';

interface CustomizerProps {
  activeColor: string;
  onChangeColor: (color: string) => void;
}

export const Customizer: React.FC<CustomizerProps> = ({
  activeColor,
  onChangeColor,
}) => {
  const colors = [
    { name: 'Crimson', hex: '#ef4444' },
    { name: 'Cyan Glow', hex: '#06b6d4' },
    { name: 'Purple Ray', hex: '#a855f7' },
    { name: 'Neon Green', hex: '#10b981' },
  ];

  return (
    <div className="bg-black/70 border border-red-500/20 p-3.5 rounded-2xl flex items-center justify-between w-full max-w-2xl backdrop-blur-2xl shadow-[0_0_25px_rgba(239,68,68,0.08)]">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-red-400/90 tracking-widest">
          ESTILO DO HUD
        </span>
        <span className="text-[10px] text-neutral-500">
          Paleta de iluminação em tempo real
        </span>
      </div>

      <div className="flex items-center gap-3">
        {colors.map((c) => (
          <button
            key={c.hex}
            onClick={() => onChangeColor(c.hex)}
            style={{ backgroundColor: c.hex }}
            className={`w-5 h-5 rounded-full border transition-all duration-200 ${
              activeColor === c.hex
                ? 'border-white scale-125 shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
};