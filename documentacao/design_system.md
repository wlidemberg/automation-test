# Design System - Automation Test

Este documento estabelece as especificações de design e diretrizes de UI/UX para a plataforma **Automation Test**. A nossa identidade visual adota a estética **Tech-Luxo** (um cruzamento entre minimalismo de luxo, alta tecnologia e contrastes cyberpunk refinados).

---

## 1. Diretrizes de Estilo (Estética Tech-Luxo)

A estética **Tech-Luxo** baseia-se em quatro pilares fundamentais:
1. **Escuridão Absoluta**: Fundos escuros profundos e pretos puros que eliminam distrações e criam uma atmosfera premium de software de elite.
2. **Contraste Cirúrgico**: Uso pontual e minimalista de cores neon vibrantes (principalmente Verde Neon) para guiar o olhar do usuário.
3. **Geometria de Alta Precisão**: Linhas ultrafinas (1px), cantos ligeiramente arredondados (estilo hardware premium) e layouts simétricos baseados em grid.
4. **Efeitos Atmosféricos**: Brilhos sutis (glow), transparências com desfoque de fundo (glassmorphism) e micro-interações fluidas.

---

## 2. Paleta de Cores (Tailwind CSS Configured)

Todas as cores foram integradas sob o prefixo `brand` no arquivo `tailwind.config.js` para utilização direta:

| Nome Tailwind | Hex | Descrição | Utilização |
| :--- | :--- | :--- | :--- |
| **`brand-dark`** | `#050505` | Preto absoluto de fundo | Fundo principal da aplicação (`body`) |
| **`brand-neon`** | `#CCFF00` | Verde lima / Neon vibrante | Call to Action (CTA), status ativo, bordas iluminadas |
| **`brand-gray`** | `#1A1A1A` | Cinza profundo elegante | Fundo de cards, painéis, modais e bordas estruturais |
| **`white`** | `#FFFFFF` | Branco puro | Texto principal, títulos e elementos de destaque |
| **`gray-400`/`gray-500`**| `#9CA3AF` / `#6B7280` | Tons de cinza de suporte | Textos secundários e descrições menos relevantes |


---

## 3. Tipografia e Escala

A tipografia deve evocar modernidade, sofisticação e precisão técnica.

*   **Títulos Monumentais (Headers)**:
    *   **Fonte**: *Space Grotesk* ou *Inter* (Google Fonts).
    *   **Estilo**: Sans-serif de alta precisão geométrica, pesos Bold ou Extra-Bold (700/800).
    *   **Espaçamento de Letras**: Levemente expandido para títulos (`tracking-wider` ou `tracking-widest`).
*   **Texto de Leitura (Body)**:
    *   **Fonte**: *Inter* (Sans-Serif oficial do projeto, importada via Google Fonts e mapeada em `font-sans` no `tailwind.config.js`).
    *   **Estilo**: Sans-serif de leitura limpa e corporativa, pesos Light, Regular e Medium (300/400/500).



### Escala Tipográfica (Exemplos Tailwind)
*   `text-5xl` ou `text-6xl`: Títulos de páginas de destaque (Landing Hero).
*   `text-3xl` ou `text-4xl`: Cabeçalhos de seções principais.
*   `text-xl` ou `text-2xl`: Títulos de cards ou subseções.
*   `text-base`: Texto padrão para corpo de parágrafos.
*   `text-sm` ou `text-xs`: Metadados, labels de inputs e dados secundários.

---

## 4. Elementos Visuais e Componentes de UI

### Bordas e Linhas de Grade
*   Todas as bordas devem ter a espessura padrão de `1px`.
*   Usar gradientes lineares sutis em bordas ativas (ex: gradiente de `brand-gray` para `brand-neon`).
*   Configuração do arredondamento: cantos discretos (`rounded-sm` ou `rounded-md`, equivalente a `4px` e `6px`). Evitar cantos muito arredondados (`rounded-2xl` ou superior), para manter a robustez geométrica.

### Efeitos de Vidro (Glassmorphism)
*   Menus suspensos, cabeçalhos fixos e elementos sobrepostos devem usar opacidade no fundo combinada com filtro de desfoque para manter o contexto visual do conteúdo traseiro sem comprometer a legibilidade.
*   **Regra de opacidade de fundo**: `80%` a `95%` de opacidade de fundo (`bg-brand-dark/80` ou `bg-brand-gray/95`).
*   **Intensidade do Desfoque (Blur)**: Mínimo de `8px` (`backdrop-blur-md` ou `backdrop-blur-lg`).
*   **Bordas de Separação**: Adicionar sempre uma borda ultra-fina (`1px`) semi-transparente na base ou no contorno do elemento (`border-brand-gray/60` ou `border-white/5`) para delinear o componente.
*   **Classes Tailwind recomendadas**:
    *   Para Header Fixo: `bg-brand-dark/80 backdrop-blur-md border-b border-brand-gray/60`
    *   Para Modais/Dropdowns: `bg-brand-gray/95 backdrop-blur-lg border border-brand-gray`


### Glow (Brilho Neon)
*   Destaques visuais e estados de foco devem irradiar um brilho sutil.
*   **Classe Tailwind configurada**: `shadow-glow-neon` (mapeada no `tailwind.config.js` com sombra baseada em `#CCFF00`).


### Badges de Preços Compostos (Setup vs. Recorrência)
Para expressar as propostas comerciais de maneira elegante, a interface divide os custos em duas dimensões (Implementação Única vs. Assinatura Mensal). Cada dimensão deve ser apresentada em blocos lado a lado, utilizando contrastes cirúrgicos sob a estrutura Tech-Luxo:

*   **Setup (Valor Único)**:
    *   **Estilo**: Fundo em `brand-gray` semi-transparente (`bg-brand-gray/60`), borda sutil de 1px (`border-white/5`), desfoque de fundo (`backdrop-blur-sm`).
    *   **Texto**: Título da dimensão ("SETUP") em caixa alta, fonte mono pequena (`text-[9px]`), espaçamento expandido e cor cinza de suporte (`text-gray-500`). O valor é exibido em branco puro (`text-white`) com peso negrito (`font-bold`).
*   **Mensalidade (Recorrência)**:
    *   **Estilo**: Mesma estrutura física (fundo glassmorphism, borda de 1px).
    *   **Texto**: Título da dimensão ("MENSALIDADE") em caixa alta e cinza. O valor é destacado com a cor neon oficial (`text-brand-neon`) com peso negrito (`font-bold`) e o sufixo `/mês` para indicar claramente a recorrência.
*   **Padrão de Exibição Gratuito/Isento**:
    *   Quando `valor_implementacao` for `0` ou nulo, o badge deve indicar textualmente **"Gratuito"**.
    *   Quando `valor_mensalidade` for `0` ou nulo, o badge deve indicar textualmente **"Isento"**.

### Progresso Percentual e Checklist de Roadmap (Dashboard)
Para manter o alinhamento de alta fidelidade visual com os dados de engenharia, o painel do cliente adota padrões de design específicos para o progresso de entrega de projetos:

*   **Indicador de Progresso Percentual**:
    *   **Estrutura**: Barra horizontal com trilha de fundo na cor escura semi-transparente (`bg-white/5`), altura ultra-fina de 4px (`h-1`), cantos totalmente arredondados (`rounded-full`). A barra de preenchimento ativo deve ser renderizada na cor sólida Verde Neon (`bg-brand-neon`).
    *   **Metadados de Apoio**: Abaixo da barra de progresso, um grid flexível exibe o rótulo "PROGRESSO" à esquerda e o percentual textual à direita (ex: "60%"), ambos utilizando a fonte mono, tamanho micro (`text-[9px]`) e cor cinza média (`text-gray-500`) em caixa alta.
*   **Checklist de Cronograma (Timeline Roadmap)**:
    *   **Estrutura de Linha**: Uma linha vertical ultrafina (`border-l border-white/10`) guia o olhar do usuário ao longo das etapas. Cada etapa possui um recuo lateral de 24px (`pl-6`).
    *   **Marcador Visual de Etapa (Timeline Points)**:
        *   **Concluído (`status: 'done'`)**: Um círculo de 16px (`w-4 h-4`) preenchido com Verde Neon (`bg-brand-neon`) contendo um ícone de check-circle preto. O título da fase é renderizado em branco puro (`text-white`) com peso negrito (`font-bold`).
        *   **Em Andamento (`status: 'current'`)**: Um círculo de 16px com fundo escuro e borda Verde Neon (`border-brand-neon`) animado com um pulso suave (`animate-pulse`). O título da fase é destacado na cor Verde Neon (`text-brand-neon`) com peso negrito.
        *   **Pendente (`status: 'pending'`)**: Um círculo de 16px com fundo cinza escuro (`bg-zinc-900`) e borda sutil (`border-white/10`). O título da fase é exibido em cinza opaco (`text-gray-600`).

---



## 5. Diretrizes de Animação (Framer Motion)

Animações devem ser rápidas, orgânicas e imperceptíveis na velocidade, mas marcantes na experiência de luxo.

*   **Curva de Transição Base (Easing)**: Usar curvas personalizadas em vez de lineares. A curva cúbica sugerida é `[0.16, 1, 0.3, 1]` (ultra-suave no final).
*   **Duração Padrão**: Entre `0.2s` (para interações de hover) e `0.5s` (para transições de página inteira).

### Exemplos de Comportamento Framer Motion:

1.  **Entrada de Página (Fade In & Slide Up)**:
    ```typescript
    const pageTransition = {
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0 },
      transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 }
    };
    ```

2.  **Hover Magnético em Botões Principais**:
    ```typescript
    const buttonHover = {
      hover: { scale: 1.02, boxShadow: "0 0 20px rgba(0, 255, 102, 0.4)" },
      tap: { scale: 0.98 }
    };
    ```

3.  **Cascata de Cards (Staggered Animation)**:
    Quando múltiplos elementos entrarem na tela (ex: cards no dashboard), a animação de cada card sucessivo deve ter um pequeno atraso (`delay`) incremental para criar um efeito de cascata refinado.

4.  **Revelação do Hero (Hero Section Reveal)**:
    Os componentes do Hero (subtítulo, título principal, descrição e CTAs) devem surgir em cascata vertical, movendo-se de baixo para cima com fade-in.
    *   **Variants Sugeridas**:
        ```typescript
        const container = {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
          }
        };
        const item = {
          hidden: { opacity: 0, y: 25 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }
        };
        ```

