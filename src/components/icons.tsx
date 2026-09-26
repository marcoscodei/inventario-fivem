import React from 'react';

interface IconProps {
  className?: string;
}

// Ícones em SVG puro: renderizam sempre no tamanho certo, independente da
// fonte do navegador (diferente de emoji, que pode "quebrar" e aparecer
// como um glyph de fallback gigante em navegadores embutidos, ex: NUI/CEF).

const Base: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? 'w-6 h-6'}
  >
    {children}
  </svg>
);

export const WeaponIcon: React.FC<IconProps> = ({ className }) => (
  <Base className={className}>
    <path d="M3 14h9l2-2h6v3h-2l-1 3h-4l-1-2H8l-1 2H4l1-3H3z" />
    <path d="M13 12V8h3v2" />
    <circle cx="6.5" cy="17.5" r="0.8" fill="currentColor" stroke="none" />
  </Base>
);

export const WaterIcon: React.FC<IconProps> = ({ className }) => (
  <Base className={className}>
    <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" />
  </Base>
);

export const MedkitIcon: React.FC<IconProps> = ({ className }) => (
  <Base className={className}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M12 11v6M9 14h6" />
  </Base>
);

export const PhoneIcon: React.FC<IconProps> = ({ className }) => (
  <Base className={className}>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <path d="M11 18h2" />
  </Base>
);

export const RadioIcon: React.FC<IconProps> = ({ className }) => (
  <Base className={className}>
    <rect x="4" y="9" width="16" height="11" rx="2" />
    <path d="M8 9V6l8-2v5" />
    <circle cx="8.5" cy="14.5" r="1.4" />
    <path d="M13 13.5h4M13 16h4" />
  </Base>
);

export const BurgerIcon: React.FC<IconProps> = ({ className }) => (
  <Base className={className}>
    <path d="M4 10a8 6 0 0 1 16 0z" />
    <path d="M3 13h18" />
    <path d="M4 16h16a1 1 0 0 1 1 1 3 3 0 0 1-3 3H6a3 3 0 0 1-3-3 1 1 0 0 1 1-1z" />
  </Base>
);

export const ToolIcon: React.FC<IconProps> = ({ className }) => (
  <Base className={className}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z" />
  </Base>
);

export const KeyIcon: React.FC<IconProps> = ({ className }) => (
  <Base className={className}>
    <circle cx="8" cy="8" r="4" />
    <path d="M10.8 10.8 20 20M15 15l2.5 2.5M18 12l2.5 2.5" />
  </Base>
);

export const BoxIcon: React.FC<IconProps> = ({ className }) => (
  <Base className={className}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8z" />
    <path d="M3 8l9 5 9-5M12 13v8" />
  </Base>
);

/** Resolve o ícone certo a partir do nome interno do item */
export const ItemIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  switch (name) {
    case 'water':
      return <WaterIcon className={className} />;
    case 'medkit':
      return <MedkitIcon className={className} />;
    case 'phone':
      return <PhoneIcon className={className} />;
    case 'radio':
      return <RadioIcon className={className} />;
    case 'burger':
      return <BurgerIcon className={className} />;
    case 'lockpick':
      return <ToolIcon className={className} />;
    case 'key':
      return <KeyIcon className={className} />;
    default:
      if (name.startsWith('weapon_')) return <WeaponIcon className={className} />;
      return <BoxIcon className={className} />;
  }
};