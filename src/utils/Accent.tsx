import type { CSSProperties } from 'react';

export const hexToRgba = (hex: string, alpha: number): string => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Gera as variáveis CSS (--accent, --accent-15, --accent-25...) que os componentes
// usam via classes arbitrárias do Tailwind, ex: text-[var(--accent)].
// Aplique isso no elemento raiz do App; como é uma custom property, ela é
// herdada automaticamente por todos os componentes filhos.
export const buildAccentVars = (hex: string): CSSProperties =>
  ({
    '--accent': hex,
    '--accent-15': hexToRgba(hex, 0.15),
    '--accent-20': hexToRgba(hex, 0.2),
    '--accent-25': hexToRgba(hex, 0.25),
    '--accent-30': hexToRgba(hex, 0.3),
    '--accent-40': hexToRgba(hex, 0.4),
    '--accent-50': hexToRgba(hex, 0.5),
  }) as CSSProperties;