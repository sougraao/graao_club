# Glass Pop 2.0 — Catálogo de contratos

As classes existentes continuam na vitrine. “Specification” indica composição documentada ainda sem controlador dedicado. Nenhuma integração React é apresentada como instalada.

## Actions

### Primary
- **Propósito / API:** .g-btn--accent; actions com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-btn--accent` é o ponto de composição.

### Secondary
- **Propósito / API:** .g-btn; actions com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-btn` é o ponto de composição.

### Glass
- **Propósito / API:** .g-btn.g-glass; actions com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-btn.g-glass` é o ponto de composição.

### Ghost
- **Propósito / API:** .g-btn--quiet; actions com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-btn--quiet` é o ponto de composição.

### Highlight
- **Propósito / API:** .g-btn--yellow; actions com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-btn--yellow` é o ponto de composição.

### Icon button
- **Propósito / API:** .g-icon-btn; actions com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-icon-btn` é o ponto de composição.

### Destructive
- **Propósito / API:** .g-btn--hold[data-g-hold]; actions com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-btn--hold[data-g-hold]` é o ponto de composição.

## Forms

### Input / textarea / select / date
- **Propósito / API:** .g-field; forms com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-field` é o ponto de composição.

### Checkbox / radio
- **Propósito / API:** .g-check; forms com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-check` é o ponto de composição.

### Switch
- **Propósito / API:** .g-switch; forms com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-switch` é o ponto de composição.

### Slider
- **Propósito / API:** input[type=range]; forms com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `input[type=range]` é o ponto de composição.

### Upload
- **Propósito / API:** input[type=file]; forms com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `input[type=file]` é o ponto de composição.

### Multi-step form
- **Propósito / API:** form + fieldset + progress; forms com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `form + fieldset + progress` é o ponto de composição.

## Navigation

### Navbar / glass navbar
- **Propósito / API:** .g-pop-nav / .g-glass; navigation com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-nav / .g-glass` é o ponto de composição.

### Sidebar
- **Propósito / API:** .g-sidenav; navigation com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-sidenav` é o ponto de composição.

### Tabs
- **Propósito / API:** .g-tabs[data-g-tabs]; navigation com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-tabs[data-g-tabs]` é o ponto de composição.

### Breadcrumbs
- **Propósito / API:** nav[aria-label] + ol; navigation com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `nav[aria-label] + ol` é o ponto de composição.

### Dock / mobile menu
- **Propósito / API:** .g-tabbar; navigation com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-tabbar` é o ponto de composição.

### Context menu
- **Propósito / API:** .g-menu; navigation com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-menu` é o ponto de composição.

## Feedback

### Alert
- **Propósito / API:** .g-card[role=status]; feedback com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-card[role=status]` é o ponto de composição.

### Toast
- **Propósito / API:** G.toast; feedback com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `G.toast` é o ponto de composição.

### Loading / skeleton
- **Propósito / API:** .g-skeleton; feedback com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-skeleton` é o ponto de composição.

### Progress
- **Propósito / API:** .g-progress / .g-ring; feedback com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-progress / .g-ring` é o ponto de composição.

### Empty state
- **Propósito / API:** .g-empty; feedback com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-empty` é o ponto de composição.

### Confirmation
- **Propósito / API:** G.modal; feedback com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `G.modal` é o ponto de composição.

## Overlays

### Modal / dialog / drawer
- **Propósito / API:** G.modal / G.modal({sheet:true}); overlays com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `G.modal / G.modal({sheet:true})` é o ponto de composição.

### Popover
- **Propósito / API:** .g-popover; overlays com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-popover` é o ponto de composição.

### Tooltip
- **Propósito / API:** .g-tooltip[data-tip]; overlays com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-tooltip[data-tip]` é o ponto de composição.

### Image lightbox
- **Propósito / API:** .g-pop-lightbox; overlays com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-lightbox` é o ponto de composição.

## Display

### Card
- **Propósito / API:** .g-card; display com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-card` é o ponto de composição.

### Badge
- **Propósito / API:** .g-badge; display com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-badge` é o ponto de composição.

### Avatar
- **Propósito / API:** .g-avatar; display com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-avatar` é o ponto de composição.

### Accordion
- **Propósito / API:** details + summary; display com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `details + summary` é o ponto de composição.

### Table
- **Propósito / API:** .g-table; display com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-table` é o ponto de composição.

### List
- **Propósito / API:** .g-row; display com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-row` é o ponto de composição.

### Timeline
- **Propósito / API:** .flow__steps; display com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.flow__steps` é o ponto de composição.

### Indicator
- **Propósito / API:** .g-status; display com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-status` é o ponto de composição.

## Media

### Editorial Image
- **Propósito / API:** .g-pop-art; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-art` é o ponto de composição.

### Full Bleed Hero
- **Propósito / API:** figure + .g-pop-art; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `figure + .g-pop-art` é o ponto de composição.

### Framed Photo
- **Propósito / API:** .g-frame; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-frame` é o ponto de composição.

### Image Stack
- **Propósito / API:** .g-stack-cards; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-stack-cards` é o ponto de composição.

### Photo Collage
- **Propósito / API:** .g-pop-grid; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-grid` é o ponto de composição.

### Image Bento
- **Propósito / API:** .g-pop-grid; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-grid` é o ponto de composição.

### Image Gallery
- **Propósito / API:** #g-pop-gallery; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `#g-pop-gallery` é o ponto de composição.

### Masonry Gallery
- **Propósito / API:** CSS columns; specification; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `CSS columns; specification` é o ponto de composição.

### Circular Gallery
- **Propósito / API:** React Bits; deferred; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `React Bits; deferred` é o ponto de composição.

### Horizontal Gallery
- **Propósito / API:** .g-scroll--x; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-scroll--x` é o ponto de composição.

### Image Lightbox
- **Propósito / API:** .g-pop-lightbox; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-lightbox` é o ponto de composição.

### Image With Glass Overlay
- **Propósito / API:** .g-pop-stage + figcaption.g-glass; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-stage + figcaption.g-glass` é o ponto de composição.

### Product Mockup
- **Propósito / API:** .g-frame; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-frame` é o ponto de composição.

### Soft 3D Stage
- **Propósito / API:** .g-pop-stage; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-stage` é o ponto de composição.

### Before/After Image
- **Propósito / API:** range + two images; specification; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `range + two images; specification` é o ponto de composição.

### Immersive Media Section
- **Propósito / API:** figure + .g-noite; media com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `figure + .g-noite` é o ponto de composição.

## Page structures

### Editorial hero
- **Propósito / API:** .g-pop-hero; page structures com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-hero` é o ponto de composição.

### Editorial section
- **Propósito / API:** .g-pop-section; page structures com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-section` é o ponto de composição.

### Bento
- **Propósito / API:** .g-pop-grid; page structures com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-grid` é o ponto de composição.

### Dashboard / content area
- **Propósito / API:** .g-pop-workspace; page structures com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-workspace` é o ponto de composição.

### Footer
- **Propósito / API:** .g-pop-footer; page structures com hierarquia clara.
- **Anatomia:** raiz semântica, conteúdo, rótulo acessível, ação ou estado opcional.
- **Variantes / tamanhos:** Dia, Noite, alto contraste; controles 32/40/52px, toque mínimo 44px; cards 24/32px de padding.
- **Tokens:** `--g-text`, `--g-text-2`, `--g-surface`, `--g-line`, `--g-accent-text`, espaços e raios `--g-*`.
- **Estados:** default, hover, focus-visible, active; disabled e erro quando aplicáveis; estado nunca comunicado apenas por cor.
- **Propriedades:** texto obrigatório, identificação estável; mídia exige alt, dimensões e foco; ações exigem nome e destino ou handler.
- **Comportamento:** ações explícitas; não iniciar autoplay; estado persistido somente quando informado; exclusão exige confirmação ou desfazer.
- **Responsividade:** conteúdo reflow em 320px; uma coluna abaixo de 520px, grids por conteúdo; nenhuma informação exclusiva de hover.
- **Acessibilidade:** HTML nativo primeiro, teclado e foco visível, status anunciado sem roubar foco; overlay exige Escape, contenção e retorno do foco.
- **Exemplo / evidência:** `design-system.html` para componentes herdados; `glass-pop.html` para materiais, filtros, lightbox e planejamento. `.g-pop-footer` é o ponto de composição.
