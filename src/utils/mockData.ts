import type { InventoryData } from '../types/inventory';

export const initialMockData: InventoryData = {
  info: {
    name: "Marcos Boni",
    passport: "0123",
    phone: "000-000",
    job: "Taxista",
    bank: 1000000,
    wallet: 5000,
    weight: 10.0,
    maxWeight: 50.0,
  },
  weapons: [
    { id: "1", name: "weapon_assaultrifle", label: "AK-47", ammo: 200 },
    { id: "2", name: "weapon_pistol", label: "Pistola 9mm", ammo: 80 },
    { id: "3", name: "weapon_knife", label: "Faca de Caça", ammo: 1 },
  ],
  items: {
    1: { name: "weed", label: "Maconha", amount: 20, weight: 0.5 },
    2: { name: "water", label: "Garrafa d'Água", amount: 3, weight: 0.5 },
    5: { name: "medkit", label: "Kit Médico", amount: 1, weight: 1.0 },
    12: { name: "phone", label: "Celular", amount: 1, weight: 0.2 },
  },
};