export type ItemCategory = 'food' | 'weapon' | 'medical' | 'other' | 'key' | 'tool';

export interface Item {
  id: string;
  name: string;
  label: string;
  amount: number;
  weight: number;
  category: ItemCategory;
  durability?: number; // 0 a 100%
  description?: string;
}

export interface Weapon {
  id: string;
  name: string;
  label: string;
  ammo: number;
  durability?: number;
}

export interface PlayerInfoData {
  name: string;
  job: string;
  passport: number;
  phone: string;
  bank: number;
  wallet: number;
  weight: number;
  maxWeight: number;
  health: number;  // 0 a 100
  armor: number;   // 0 a 100
  hunger: number;  // 0 a 100
  thirst: number;  // 0 a 100
}

export interface SecondaryInventoryData {
  title: string;
  type: 'trunk' | 'chest' | 'ground' | 'player';
  maxWeight: number;
  slots: Record<number, Item>;
}