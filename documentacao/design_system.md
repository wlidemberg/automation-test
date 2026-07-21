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


### Componente de Resumo Financeiro no Checkout
Para manter a total transparência comercial e guiar a tomada de decisão no momento da contratação, o formulário de checkout adota um componente de detalhamento de valores estruturado:

*   **Contêiner Principal (Cartão do Checkout)**:
    *   **Estilo**: Fundo em preto sólido fosco (`bg-black/40`), borda de 1px na cor de separação (`border-white/5`), cantos levemente arredondados (`rounded-lg`), desfoque de fundo de vidro (`backdrop-blur-sm`).
    *   **Efeito Estético**: No topo do contêiner, uma linha fina gradiente transparente-neon-transparente (`bg-gradient-to-r from-transparent via-brand-neon/20 to-transparent`) atrai sutilmente o olhar do cliente.
*   **Destaque Financeiro da Entrada (Entrada de 50%)**:
    *   Como a ativação do serviço está vinculada ao pagamento da entrada, este elemento possui a maior hierarquia visual no resumo de faturamento.
    *   **Estilo**: Fundo em Verde Neon com baixa opacidade (`bg-brand-neon/5`), borda fina destacada em Verde Neon translúcido (`border-brand-neon/20`), cantos arredondados (`rounded`).
    *   **Tipografia**:
        *   Título ("ENTRADA OBRIGATÓRIA (50%)") e observação em cinza médio no formato micro-mono (`text-[9px] font-mono tracking-wider uppercase`).
        *   Valor em destaque total Verde Neon (`text-brand-neon`) utilizando fonte negrito de grande escala (`text-sm font-extrabold tracking-tight`).
*   **Setup e Mensalidades de Suporte**:
    *   Exibidos em fonte mono de tamanho padrão (`text-xs font-mono`) e cor cinza de suporte (`text-gray-500`) para não concorrer visualmente com a entrada obrigatória.
    *   Os valores associados usam o branco puro (`text-white`) com peso médio.


### Padrão Estrito de Modais de Alta Complexidade (Responsivos)
Para assegurar a legibilidade e usabilidade de modais volumosos (como o checkout e formulários de cadastro) em múltiplos tamanhos de tela, adota-se o padrão estrito de bloqueio de viewport e rolagem interna independente:

*   **Isolamento DOM com React Portal**: Para evitar efeitos colaterais de layout, estouro de Z-Index de elementos adjacentes ou rolagem dupla de janelas (Double Scrollbars), todo modal de alta complexidade deve ser renderizado fora do fluxo da árvore de componentes, utilizando a API `createPortal` do React para montagem direta na raiz (`document.body`).
*   **Overlay e Lock de Fundo (Backdrop & Lock)**:
    *   O overlay de fundo deve travar o scroll da página principal (`overflow-hidden`) e cobrir a viewport inteira (`fixed inset-0 z-[9999]`), centralizando o conteúdo (`flex items-center justify-center p-4`) com fundo escuro denso (`bg-black/80`) e desfoque sutil (`backdrop-blur-md`).
*   **Contêiner Principal (Card do Modal)**:
    *   **Limitação de Viewport**: Altura restrita a 90% da viewport (`max-h-[90vh]`) para garantir que o modal caiba em qualquer dispositivo.
    *   **Estrutura de Linha**: Flexível por largura (`flex flex-col lg:flex-row`), cantos arredondados de alta curvatura (`rounded-2xl`), bordas finas com contraste cinza (`border border-zinc-800`), transbordo ocultado (`overflow-hidden`) e sombra projetada suave de fundo (`shadow-2xl`).
*   **Rolagem Interna nas Colunas**:
    *   **Coluna Informativa/Financeira (Lado Esquerdo)**: Ocupa `w-full lg:w-5/12` com fundo cinza opaco (`bg-zinc-900/50`), divisória física (`border-zinc-800`) e rolagem vertical autônoma se os dados excederem a altura (`overflow-y-auto max-h-[90vh]`).
    *   **Coluna do Formulário (Lado Direito)**: Ocupa `w-full lg:w-7/12` com espaçamento interno confortável (`p-6 sm:p-8`), rolagem vertical interna dedicada (`overflow-y-auto max-h-[90vh]`) e barra de rolagem estilizada discreta (`scrollbar-thin scrollbar-thumb-zinc-700`) para não quebrar a estética premium.
*   **Botão de Fechar Absoluto (Fixo e Não-Rolável)**:
    *   Declarado como o primeiro filho direto do Card do modal (fora das colunas) para que nunca suma da viewport ao realizar scroll.
    *   **Estilo**: Círculo de alto contraste (`bg-zinc-900/90 hover:bg-zinc-800`), borda cinza proeminente (`border border-zinc-700/60`), preenchimento confortável (`p-2`) e ícone `X` (`w-5 h-5`) com transição suave (`text-zinc-400 hover:text-white transition-all`).





