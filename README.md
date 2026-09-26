# 🎒 Inventário FiveM — HUD Customizado

Sistema de inventário (NUI) para servidores **FiveM**, construído com **React + TypeScript + Vite + TailwindCSS** no front-end e um resource **Lua** integrado ao client/server do jogo.

Interface dark/red, totalmente responsiva à lógica do framework, com drag & drop, tooltips, hotbar, painel de armas equipadas e customização de cores do HUD em tempo real.

---

## ✨ Funcionalidades

- **Mochila em grade (Grid)** — slots dinâmicos, busca por nome e filtro por categoria (Comida, Médico, Armas, Ferramentas, Tudo).
- **Drag & Drop** — mover itens entre slots, equipar armas arrastando para o painel de armas, soltar/usar/enviar itens arrastando para as zonas de ação.
- **Tooltips inteligentes** — exibidos via portal (`ReactDOM.createPortal`), reposicionam automaticamente para não serem cortados por containers com `overflow`.
- **Painel do jogador (PlayerInfo)** — vida, colete, fome e sede em barras animadas, peso da mochila em anel circular (SVG), dados de passaporte/telefone e saldo de banco/carteira.
- **Painel de armas equipadas** — até 4 armas, munição e durabilidade visual.
- **Hotbar (atalhos 1–5)** — vincula itens da mochila a teclas rápidas.
- **Menu de contexto (clique direito)** — usar, enviar, atribuir atalho ou soltar item.
- **Customizer de HUD** — troca a cor de destaque da interface (Crimson, Cyan, Purple, Green) em tempo real.
- **Ícones em SVG puro** — evita bugs de emoji quebrado em navegadores embutidos (CEF/NUI).

---

## 🧱 Tecnologias

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- Lua (`client/main.lua`, `server/`) — integração NUI com o framework FiveM

---

## 📁 Estrutura do projeto

```
├── client/
│   └── main.lua              # Lógica client-side (abre/fecha NUI, eventos)
├── server/                   # Lógica server-side (itens, inventário, etc.)
├── shared/
│   └── config.lua            # Configurações do resource
├── src/
│   ├── assets/                # Imagens e ícones estáticos
│   ├── components/
│   │   ├── ContextMenu.tsx    # Menu de contexto (usar/soltar/enviar/atalho)
│   │   ├── Customizer.tsx     # Seletor de cor do HUD
│   │   ├── Hotbar.tsx         # Barra de atalhos (1-5)
│   │   ├── icons.tsx          # Ícones SVG do sistema
│   │   ├── InventoryGrid.tsx  # Grade principal da mochila
│   │   ├── InventorySlot.tsx  # Slot individual (drag/drop, tooltip)
│   │   ├── PlayerInfo.tsx     # Painel de status, finanças e ações
│   │   ├── Tooltip.tsx        # Tooltip flutuante (via portal)
│   │   └── WeaponsPanel.tsx   # Painel de armas equipadas
│   ├── hooks/
│   │   └── useNuiEvent.ts     # Hook para escutar eventos vindos do client Lua
│   ├── types/
│   │   └── inventory.ts       # Tipagens (Item, Weapon, PlayerInfoData, etc.)
│   ├── utils/
│   │   ├── Accent.ts          # Lógica de cor de destaque
│   │   ├── fetchNui.ts        # Wrapper de fetch para comunicação NUI
│   │   └── mockData.ts        # Dados mockados para desenvolvimento fora do jogo
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Instalação (servidor FiveM)

1. Clone este repositório dentro da pasta `resources` do seu servidor:
   ```bash
   cd resources
   git clone https://github.com/seu-usuario/seu-repositorio.git inventory-hud
   ```

2. Instale as dependências e gere o build de produção:
   ```bash
   cd inventory-hud
   npm install
   npm run build
   ```

3. Adicione o resource ao seu `server.cfg`:
   ```cfg
   ensure inventory-hud
   ```

4. Ajuste `shared/config.lua` conforme o seu framework (ESX, QBCore, etc.).

---

## 💻 Desenvolvimento local (fora do jogo)

O projeto pode ser testado no navegador usando dados mockados (`src/utils/mockData.ts`), sem precisar do FiveM rodando:

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

---

## 🖱️ Como usar a interface

| Ação | Como fazer |
|---|---|
| Selecionar item | Clique no slot |
| Mover item | Arraste e solte em outro slot |
| Equipar arma | Arraste o item de arma até o painel "Armas Equipadas" |
| Usar / Soltar / Enviar | Botões no painel do jogador ou arraste até a zona de ação |
| Atribuir atalho | Clique direito no item → escolha o número (1–5) |
| Usar atalho | Clique no slot da hotbar ou pressione a tecla correspondente |
| Trocar cor do HUD | Selecione uma cor no `Customizer` |

---

## 📝 Licença

Distribuído sob a licença que você definir para este projeto (ex: MIT). Edite esta seção conforme necessário.


<img width="1274" height="607" alt="image" src="https://github.com/user-attachments/assets/f6fb4ade-59e1-4b95-b3fd-65aeb5bd99ff" />

