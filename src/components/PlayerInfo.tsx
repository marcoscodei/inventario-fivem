import React from 'react';
import type { PlayerInfoData } from '../types/inventory';

interface PlayerInfoProps {
  info: PlayerInfoData;
  quantity: string;
  onChangeQuantity: (val: string) => void;
  onUseItem: () => void;
  onDropItem: () => void;
  onSendItem: () => void;
  onDropActionZone: (e: React.DragEvent, action: 'use' | 'drop' | 'send') => void;
  hasSelection: boolean;
  /** Quantidade máxima disponível do item selecionado (undefined = sem limite conhecido) */
  maxQuantity?: number;
}

const StatusBar: React.FC<{ icon: string; value: number; color: string }> = ({
  icon,
  value,
  color,
}) => (
  <div className="flex items-center gap-1.5 flex-1">
    <span className="text-xs">{icon}</span>
    <div className="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  info,
  quantity,
  onChangeQuantity,
  onUseItem,
  onDropItem,
  onSendItem,
  onDropActionZone,
  hasSelection,
  maxQuantity,
}) => {
  const weightPercent = Math.min((info.weight / info.maxWeight) * 100, 100);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (weightPercent / 100) * circumference;

  const actionBtnClass =
    'text-xs font-black py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-center disabled:opacity-30 disabled:pointer-events-none cursor-pointer';

  // Só deixa passar dígitos; limita ao estoque disponível (se conhecido) em tempo real
  const handleQuantityChange = (raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, '');

    if (digitsOnly === '') {
      onChangeQuantity('');
      return;
    }

    // Remove zeros à esquerda ("007" -> "7"), mantendo string
    let parsed = parseInt(digitsOnly, 10);
    if (maxQuantity !== undefined && parsed > maxQuantity) {
      parsed = maxQuantity;
    }
    onChangeQuantity(String(parsed));
  };

  // Ao sair do campo, garante que nunca fique vazio ou abaixo de 1
  const handleQuantityBlur = () => {
    const parsed = parseInt(quantity, 10);
    if (isNaN(parsed) || parsed < 1) {
      onChangeQuantity('1');
    } else if (maxQuantity !== undefined && parsed > maxQuantity) {
      onChangeQuantity(String(maxQuantity));
    }
  };

  return (
    <div className="w-80 flex flex-col gap-4 select-none">
      <div className="bg-[#050508]/90 backdrop-blur-2xl p-5 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 font-black text-lg shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            {info.name.substring(0, 1)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">{info.name}</h3>
            <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded-md border border-red-500/20 uppercase inline-block mt-0.5">
              {info.job}
            </span>
          </div>
        </div>

        {/* Status vitais */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <StatusBar icon="❤️" value={info.health} color="#ef4444" />
            <StatusBar icon="🛡️" value={info.armor} color="#3b82f6" />
          </div>
          <div className="flex gap-3">
            <StatusBar icon="🍗" value={info.hunger} color="#f59e0b" />
            <StatusBar icon="💧" value={info.thirst} color="#06b6d4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
          <div className="bg-[#0c0c12] p-2 rounded-xl border border-white/5">
            <span className="text-neutral-500 block text-[9px] font-bold uppercase">Passaporte</span>
            <span className="font-mono font-bold text-neutral-200">#{info.passport}</span>
          </div>
          <div className="bg-[#0c0c12] p-2 rounded-xl border border-white/5">
            <span className="text-neutral-500 block text-[9px] font-bold uppercase">Telefone</span>
            <span className="font-mono font-bold text-neutral-200">{info.phone}</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
          <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">Finanças</span>

          <div className="flex justify-between items-center bg-[#0c0c12] p-2.5 rounded-xl border border-white/5">
            <span className="text-neutral-400 text-xs font-semibold">💳 Banco</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              R$ {info.bank.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#0c0c12] p-2.5 rounded-xl border border-white/5">
            <span className="text-neutral-400 text-xs font-semibold">💵 Carteira</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              R$ {info.wallet.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#050508]/90 backdrop-blur-2xl p-5 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col items-center gap-4">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="56" cy="56" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="7" fill="transparent" />
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="#ef4444"
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-black font-mono text-white">
              {info.weight.toFixed(1)} / {info.maxWeight.toFixed(1)}
            </span>
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
              Peso (kg)
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2.5">
          <div
            onDragOver={(e) => e.preventDefault()}
            className="bg-[#0c0c12] border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-neutral-400 text-[10px] font-black uppercase">Quantidade:</span>
              {hasSelection && maxQuantity !== undefined && (
                <span className="text-neutral-600 text-[9px] font-mono">
                  Disponível: {maxQuantity.toLocaleString('pt-BR')}
                </span>
              )}
            </div>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={maxQuantity}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              onBlur={handleQuantityBlur}
              className="bg-transparent text-right font-mono text-white font-bold w-20 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onUseItem}
              disabled={!hasSelection}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropActionZone(e, 'use')}
              className={`${actionBtnClass} bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 hover:text-white`}
            >
              Usar
            </button>
            <button
              onClick={onDropItem}
              disabled={!hasSelection}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropActionZone(e, 'drop')}
              className={`${actionBtnClass} bg-red-600/20 hover:bg-red-600 border border-red-500/40 hover:border-red-500 text-red-300 hover:text-white`}
            >
              Soltar
            </button>
          </div>

          <button
            onClick={onSendItem}
            disabled={!hasSelection}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDropActionZone(e, 'send')}
            className={`${actionBtnClass} bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-neutral-200`}
          >
            Enviar para Próximo
          </button>
        </div>
      </div>
    </div>
  );
};