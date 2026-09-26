import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onUse: () => void;
  onDrop: () => void;
  onSend: () => void;
  onAssignHotkey: (key: number) => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onUse,
  onDrop,
  onSend,
  onAssignHotkey,
  onClose,
}) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/20"
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div
        style={{ top: y, left: x }}
        className="absolute bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.9)] p-1.5 w-44 flex flex-col gap-1 text-xs z-50 select-none backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onUse();
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-600 hover:text-white font-bold transition-colors text-neutral-200 flex items-center justify-between cursor-pointer"
        >
          <span>Usar Item</span>
          <span>⚡</span>
        </button>
        <button
          onClick={() => {
            onSend();
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 font-bold transition-colors text-neutral-300 flex items-center justify-between cursor-pointer"
        >
          <span>Enviar</span>
          <span>🤝</span>
        </button>

        <div className="h-px bg-white/5 my-0.5" />

        <span className="px-3 pt-1 pb-0.5 text-[9px] font-black text-neutral-600 uppercase tracking-wider">
          Atalho rápido
        </span>
        <div className="flex gap-1 px-2 pb-1.5">
          {[1, 2, 3, 4, 5].map((k) => (
            <button
              key={k}
              onClick={() => {
                onAssignHotkey(k);
                onClose();
              }}
              className="flex-1 py-1 rounded-lg bg-white/5 hover:bg-red-600 hover:text-white text-neutral-400 font-mono font-bold text-[10px] transition-colors cursor-pointer"
            >
              {k}
            </button>
          ))}
        </div>

        <div className="h-px bg-white/5 my-0.5" />

        <button
          onClick={() => {
            onDrop();
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-600 hover:text-white font-bold transition-colors text-red-400 flex items-center justify-between cursor-pointer"
        >
          <span>Soltar</span>
          <span>🗑️</span>
        </button>
      </div>
    </div>
  );
};