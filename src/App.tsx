import React, { useState, useEffect } from 'react';
import type { Item, Weapon, PlayerInfoData } from './types/inventory';
import { PlayerInfo } from './components/PlayerInfo';
import { InventoryGrid } from './components/InventoryGrid';
import { WeaponsPanel } from './components/WeaponsPanel';
import { Hotbar } from './components/Hotbar';
import { ContextMenu } from './components/ContextMenu';

// Dados iniciais de teste
const INITIAL_ITEMS: Record<number, Item> = {
  1: { id: '1', name: 'burger', label: 'X-Burguer', amount: 3, weight: 0.3, category: 'food', description: 'Restaura 30 de fome.' },
  2: { id: '2', name: 'water', label: 'Garrafa D\'água', amount: 5, weight: 0.5, category: 'food', description: 'Restaura 25 de sede.' },
  3: { id: '3', name: 'medkit', label: 'Kit Médico', amount: 2, weight: 1.5, category: 'medical', description: 'Restaura 50 de vida.', durability: 100 },
  4: { id: '4', name: 'weapon_pistol', label: 'Pistola 9mm', amount: 1, weight: 2.2, category: 'weapon', description: 'Pistola semiautomática.', durability: 95 },
  5: { id: '5', name: 'weapon_rifle', label: 'Fuzil AK-47', amount: 1, weight: 4.5, category: 'weapon', description: 'Fuzil de assalto potente.', durability: 80 },
  6: { id: '6', name: 'lockpick', label: 'Lockpick', amount: 10, weight: 0.1, category: 'tool', description: 'Usado para abrir fechaduras.' },
};

const INITIAL_PLAYER: PlayerInfoData = {
  name: 'Marcos Boni',
  job: 'Desenvolvedor',
  passport: '12345',
  phone: '555-0199',
  bank: 154000,
  wallet: 2850,
  health: 85,
  armor: 50,
  hunger: 40,
  thirst: 60,
  weight: 0,
  maxWeight: 30.0,
};

export default function App() {
  const [items, setItems] = useState<Record<number, Item>>(INITIAL_ITEMS);
  const [weapons, setWeapons] = useState<Weapon[]>([
    { id: 'w1', name: 'weapon_smg', label: 'Submetralhadora', ammo: 120, durability: 90 },
  ]);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfoData>(INITIAL_PLAYER);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(1);
  const [quantity, setQuantity] = useState<string>('1');
  const [hotbar, setHotbar] = useState<Record<number, number>>({ 1: 1, 2: 2, 3: 3 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; slot: number } | null>(null);

  // Recalcula o peso total sempre que os itens na mochila mudam
  useEffect(() => {
    let totalWeight = 0;
    Object.values(items).forEach((item) => {
      if (item) {
        totalWeight += item.weight * item.amount;
      }
    });
    setPlayerInfo((prev) => ({ ...prev, weight: totalWeight }));
  }, [items]);

  // --- CORREÇÃO DA QUANTIDADE ---
  // Sempre que o slot selecionado ou os itens mudarem (ex: usou/soltou parte do
  // estoque), garante que o valor de "quantity" continue válido: nunca vazio,
  // nunca menor que 1 e nunca maior que o "amount" do item selecionado.
  // Sem seleção, volta para '1' como padrão.
  useEffect(() => {
    if (!selectedSlot || !items[selectedSlot]) {
      setQuantity('1');
      return;
    }

    const max = items[selectedSlot].amount;
    setQuantity((prev) => {
      const parsed = parseInt(prev, 10);
      if (isNaN(parsed) || parsed < 1) return '1';
      if (parsed > max) return String(max);
      return prev;
    });
  }, [selectedSlot, items]);

  // Captura atalhos numéricos (1 a 5) do teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key) && document.activeElement?.tagName !== 'INPUT') {
        const keyNum = parseInt(e.key, 10);
        handleUseHotkey(keyNum);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotbar, items]);

  // Função auxiliar para remover/reduzir a quantidade de um item
  const consumeItemAmount = (slotIndex: number, qtyToConsume: number) => {
    setItems((prevItems) => {
      const item = prevItems[slotIndex];
      if (!item) return prevItems;

      const newAmount = item.amount - qtyToConsume;
      const next = { ...prevItems };

      if (newAmount <= 0) {
        delete next[slotIndex];
        // Remove da hotbar se estivesse associado
        setHotbar((prevHotbar) => {
          const updatedHotbar = { ...prevHotbar };
          Object.entries(updatedHotbar).forEach(([k, s]) => {
            if (s === slotIndex) delete updatedHotbar[Number(k)];
          });
          return updatedHotbar;
        });
        if (selectedSlot === slotIndex) {
          setSelectedSlot(null);
        }
      } else {
        next[slotIndex] = { ...item, amount: newAmount };
      }
      return next;
    });
  };

  // Lê a quantidade digitada já garantindo um número válido (>= 1) e
  // limitado ao estoque real do item no slot informado.
  const getSafeQuantity = (slotIndex: number, item: Item) => {
    const requestedQty = Math.max(1, parseInt(quantity, 10) || 1);
    return Math.min(requestedQty, item.amount);
  };

  // --- Lógica de USAR ITEM ---
  const handleUse = (slotIndex: number | null = selectedSlot) => {
    if (!slotIndex) return;
    const item = items[slotIndex];
    if (!item) return;

    const qtyToUse = getSafeQuantity(slotIndex, item);

    // Efeitos por categoria / tipo de item
    if (item.category === 'weapon') {
      // Se for arma, move para o painel de armas equipadas (sempre 1 por vez)
      if (weapons.length >= 4) {
        alert('Você já possui 4 armas equipadas!');
        return;
      }
      setWeapons((prev) => [
        ...prev,
        {
          id: `w-${Date.now()}`,
          name: item.name,
          label: item.label,
          ammo: 30,
          durability: item.durability ?? 100,
        },
      ]);
      consumeItemAmount(slotIndex, 1);
      return;
    }

    // Aplica efeitos vitais
    if (item.name === 'burger') {
      setPlayerInfo((p) => ({ ...p, hunger: Math.min(100, p.hunger + 30 * qtyToUse) }));
    } else if (item.name === 'water') {
      setPlayerInfo((p) => ({ ...p, thirst: Math.min(100, p.thirst + 25 * qtyToUse) }));
    } else if (item.name === 'medkit') {
      setPlayerInfo((p) => ({ ...p, health: Math.min(100, p.health + 50 * qtyToUse) }));
    }

    consumeItemAmount(slotIndex, qtyToUse);
  };

  // --- Lógica de SOLTAR ITEM ---
  const handleDrop = (slotIndex: number | null = selectedSlot) => {
    if (!slotIndex) return;
    const item = items[slotIndex];
    if (!item) return;

    const qtyToDrop = getSafeQuantity(slotIndex, item);
    consumeItemAmount(slotIndex, qtyToDrop);
  };

  // --- Lógica de ENVIAR ITEM ---
  const handleSend = (slotIndex: number | null = selectedSlot) => {
    if (!slotIndex) return;
    const item = items[slotIndex];
    if (!item) return;

    const qtyToSend = getSafeQuantity(slotIndex, item);

    alert(`Você enviou x${qtyToSend} ${item.label} para o jogador mais próximo.`);
    consumeItemAmount(slotIndex, qtyToSend);
  };

  // Desequipar todas as armas e mandar de volta pra mochila
  const handleUnequipAll = () => {
    if (weapons.length === 0) return;

    setItems((prevItems) => {
      const next = { ...prevItems };
      weapons.forEach((w) => {
        // Encontra o primeiro slot livre
        let freeSlot = 1;
        while (next[freeSlot]) {
          freeSlot++;
        }
        if (freeSlot <= 30) {
          next[freeSlot] = {
            id: `item-${Date.now()}-${freeSlot}`,
            name: w.name,
            label: w.label,
            amount: 1,
            weight: 2.5,
            category: 'weapon',
            durability: w.durability,
          };
        }
      });
      return next;
    });

    setWeapons([]);
  };

  // --- DRAG AND DROP DA MOCHILA ---
  const handleDragStart = (e: React.DragEvent, slot: number) => {
    e.dataTransfer.setData('sourceSlot', slot.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropSlot = (e: React.DragEvent, targetSlot: number) => {
    e.preventDefault();
    const sourceSlotStr = e.dataTransfer.getData('sourceSlot');
    if (!sourceSlotStr) return;

    const sourceSlot = parseInt(sourceSlotStr, 10);
    if (sourceSlot === targetSlot) return;

    setItems((prev) => {
      const next = { ...prev };
      const sourceItem = next[sourceSlot];
      const targetItem = next[targetSlot];

      // Se for o mesmo tipo de item, empilha
      if (sourceItem && targetItem && sourceItem.name === targetItem.name) {
        next[targetSlot] = {
          ...targetItem,
          amount: targetItem.amount + sourceItem.amount,
        };
        delete next[sourceSlot];
      } else {
        // Caso contrário, troca de posição
        if (sourceItem) next[targetSlot] = sourceItem;
        else delete next[targetSlot];

        if (targetItem) next[sourceSlot] = targetItem;
        else delete next[sourceSlot];
      }

      return next;
    });

    // Atualiza mapeamento de hotkey se necessário
    setHotbar((prev) => {
      const next = { ...prev };
      Object.entries(next).forEach(([k, slot]) => {
        const keyNum = Number(k);
        if (slot === sourceSlot) next[keyNum] = targetSlot;
        else if (slot === targetSlot) next[keyNum] = sourceSlot;
      });
      return next;
    });
  };

  // Arrastar item para o painel de Armas
  const handleDropWeaponFromInventory = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceSlotStr = e.dataTransfer.getData('sourceSlot');
    if (!sourceSlotStr) return;
    const sourceSlot = parseInt(sourceSlotStr, 10);
    const item = items[sourceSlot];

    if (item && item.category === 'weapon') {
      if (weapons.length >= 4) {
        alert('Você já possui 4 armas equipadas!');
        return;
      }
      setWeapons((prev) => [
        ...prev,
        {
          id: `w-${Date.now()}`,
          name: item.name,
          label: item.label,
          ammo: 30,
          durability: item.durability ?? 100,
        },
      ]);
      consumeItemAmount(sourceSlot, 1);
    } else {
      alert('Apenas itens da categoria Arma podem ser equipados!');
    }
  };

  // Arrastar para zonas de ação (botões Usar, Soltar, Enviar)
  const handleDropActionZone = (e: React.DragEvent, action: 'use' | 'drop' | 'send') => {
    e.preventDefault();
    const sourceSlotStr = e.dataTransfer.getData('sourceSlot');
    const slot = sourceSlotStr ? parseInt(sourceSlotStr, 10) : selectedSlot;

    if (!slot) return;

    if (action === 'use') handleUse(slot);
    if (action === 'drop') handleDrop(slot);
    if (action === 'send') handleSend(slot);
  };

  // Atalhos do mouse / menu de contexto
  const handleContextMenu = (e: React.MouseEvent, slot: number) => {
    e.preventDefault();
    if (items[slot]) {
      setSelectedSlot(slot);
      setContextMenu({ x: e.clientX, y: e.clientY, slot });
    }
  };

  const handleAssignHotkey = (hotkeyNumber: number) => {
    if (contextMenu?.slot) {
      setHotbar((prev) => ({
        ...prev,
        [hotkeyNumber]: contextMenu.slot,
      }));
    }
  };

  const handleUseHotkey = (hotkeyNumber: number) => {
    const slot = hotbar[hotkeyNumber];
    if (slot && items[slot]) {
      handleUse(slot);
    }
  };

  const selectedItem = selectedSlot ? items[selectedSlot] : undefined;

  return (
    <div className="min-h-screen bg-[#020204] text-white flex items-center justify-center p-8 relative overflow-hidden font-sans">
      <div className="flex gap-6 items-start z-10">
        <PlayerInfo
          info={playerInfo}
          quantity={quantity}
          onChangeQuantity={setQuantity}
          onUseItem={() => handleUse()}
          onDropItem={() => handleDrop()}
          onSendItem={() => handleSend()}
          onDropActionZone={handleDropActionZone}
          hasSelection={!!selectedItem}
          maxQuantity={selectedItem?.amount}
        />

        <InventoryGrid
          totalSlots={30}
          items={items}
          selectedSlot={selectedSlot}
          hotbar={hotbar}
          onSelectSlot={(slot) => setSelectedSlot(slot)}
          onContextMenu={handleContextMenu}
          onUnequipAll={handleUnequipAll}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDropSlot}
        />

        <WeaponsPanel
          weapons={weapons}
          onDragStartWeapon={() => {}}
          onDropWeaponFromInventory={handleDropWeaponFromInventory}
        />
      </div>

      <Hotbar hotbar={hotbar} items={items} onUseHotkey={handleUseHotkey} />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onUse={() => handleUse(contextMenu.slot)}
          onDrop={() => handleDrop(contextMenu.slot)}
          onSend={() => handleSend(contextMenu.slot)}
          onAssignHotkey={handleAssignHotkey}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}