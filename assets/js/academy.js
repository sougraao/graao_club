/* Academia: visual catalog + module details. Source of truth stays academyCatalog(). */
(() => {
  'use strict';
  const controllers = new WeakMap();
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const duration = value => { const n = Number(value) || 0; return n < 60 ? `${n} min` : `${Math.floor(n / 60)}h${n % 60 ? String(n % 60).padStart(2, '0') : ''}`; };
  const groups = [ ['start', 'Comece por aqui', 'Conheça a IA e prepare seu jeito de trabalhar.'], ['orbita', 'Método ÓRBITA', 'Do planejamento à revisão da entrega.'], ['practice', 'Aplique e evolua', 'Prática criativa, automações e um sistema que funciona para você.'] ];
  async function render(main) {
    controllers.get(main)?.abort();
    const controller = new AbortController(); controllers.set(main, controller);
    const { signal } = controller;
    const { esc, icon, mount } = window.GRAAO;
    const $ = selector => main.querySelector(selector);
    main.classList.add('g-academy');
    main.setAttribute('aria-busy', 'true');
    main.innerHTML = '<div class="g-academy-loading" role="status"><p class="g-body">Carregando a Academia…</p><div class="g-academy-grid"><div class="g-skeleton"></div><div class="g-skeleton"></div><div class="g-skeleton"></div></div></div>';
    let courses;
    try {
      courses = await window.GRAAO_API.academyCatalog();
      if (signal.aborted) return;
    } catch (error) {
      if (signal.aborted) return;
      main.innerHTML = `<div class="g-empty"><span class="g-empty__icon">${icon('book')}</span><h2 class="g-h3">A Academia não carregou</h2><p class="g-body">${esc(error.message || 'Não foi possível consultar os cursos.')}</p><button class="g-btn" type="button" data-academy-retry>Tentar novamente</button></div>`;
      $('[data-academy-retry]').addEventListener('click', () => render(main), { signal });
      main.setAttribute('aria-busy', 'false'); mount(main); return;
    }
    if (!courses.length) {
      main.innerHTML = `<div class="g-empty"><span class="g-empty__icon">${icon('book')}</span><h2 class="g-h3">A Academia está sendo preparada</h2><p class="g-body">Os cursos cadastrados aparecerão aqui quando a grade estiver disponível.</p><a class="g-btn" href="inicio.html">Voltar ao Meu Dia</a></div>`;
      main.setAttribute('aria-busy', 'false'); mount(main); return;
    }
    const modules = courses.flatMap(course => (course.modules || []).map((module, index) => ({ course, module, art:index % 8, group:/orbita/.test(normalize(module.title)) ? 'orbita' : index < 3 ? 'start' : 'practice' })));
    const totalLessons = modules.reduce((sum, entry) => sum + entry.module.lessons.length, 0);
    let search = '', filter = 'all', lastModuleId = '';
    const art = index => `<span class="g-academy-art" aria-hidden="true" style="--g-academy-x:${(index % 4) * 100 / 3}%;--g-academy-y:${index >= 4 ? 100 : 0}%"></span>`;
    const moduleDuration = module => module.lessons.reduce((sum, lesson) => sum + (Number(lesson.durationMinutes) || 0), 0);
    const moduleCard = ({ module, art:index }) => `<a class="g-academy-card" href="#${encodeURIComponent(module.id)}" aria-label="Explorar módulo ${esc(module.title)}">
      <div class="g-academy-cover">${art(index)}<span class="g-academy-cover-shade" aria-hidden="true"></span><span class="g-academy-cover-top"><span class="g-academy-index">${String(module.number).padStart(2,'0')}</span><span>Em preparação</span></span><span class="g-academy-cover-copy"><span class="g-academy-card-level">${esc(module.level)}</span><h3>${esc(module.title)}</h3></span></div>
      <span class="g-academy-card-foot"><span>${module.lessons.length} aulas · ${duration(moduleDuration(module))} estimados</span><span class="g-academy-card-arrow" aria-hidden="true">${icon('arrow-up-right','g-icon--sm')}</span></span></a>`;
    const about = course => `<details class="g-academy-about" id="${esc(course.id)}-course-about"><summary><span>Sobre ${esc(course.name)}</span>${icon('chevron-down','g-icon--sm')}</summary><div class="g-academy-about-body"><p class="g-lead">${esc(course.tagline)}</p><p class="g-body">${esc(course.summary)}</p><h3 class="g-h4">Para quem é</h3><p class="g-body">${esc(course.audience)}</p><h3 class="g-h4">Para começar</h3><ul class="g-body">${(course.prerequisites || []).map(p => `<li>${esc(p)}</li>`).join('')}</ul><h3 class="g-h4" id="${esc(course.id)}-course-projects">Projetos para aplicar</h3><div class="g-academy-projects">${(course.projects || []).map((project,index) => `<article><span class="g-caption">Projeto ${String(index+1).padStart(2,'0')}</span><h4 class="g-h4">${esc(project.name)}</h4><p class="g-body">${esc(project.description)}</p></article>`).join('')}</div><p class="g-caption">${esc(course.notice)}</p></div></details>`;
    const matches = entry => (filter === 'all' || entry.group === filter) && normalize([entry.course.name, entry.module.title, entry.module.objective, ...entry.module.lessons.map(l => l.title)].join(' ')).includes(normalize(search.trim()));
    function drawRows() {
      const selected = modules.filter(matches);
      $('[data-academy-results]').textContent = `${selected.length} ${selected.length === 1 ? 'módulo' : 'módulos'}${search.trim() ? ` para “${search.trim()}”` : ' para explorar'}`;
      $('[data-academy-rows]').innerHTML = selected.length ? courses.map(course => {
        const entries = selected.filter(entry => entry.course === course);
        if (!entries.length) return '';
        return `<section class="g-academy-course" id="${esc(course.id)}" aria-labelledby="${esc(course.id)}-course-name"><header class="g-academy-course-head"><div><h2 id="${esc(course.id)}-course-name">${esc(course.name)}</h2></div><span class="g-academy-course-meta">${course.modules.length} módulos · ${duration(course.durationMinutes)} estimadas</span></header><div id="${esc(course.id)}-grade-curso">${groups.map(([key,label,description]) => {const list=entries.filter(e=>e.group===key);return list.length ? `<section class="g-academy-shelf" aria-label="${esc(label)}"><div class="g-academy-shelf-head"><div><h3>${label}</h3><p>${description}</p></div><span>${String(list.length).padStart(2,'0')} módulos</span></div><div class="g-academy-grid" tabindex="0" aria-label="Módulos: ${esc(label)}">${list.map(moduleCard).join('')}</div></section>` : '';}).join('')}</div>${about(course)}</section>`;
      }).join('') : `<div class="g-empty"><span class="g-empty__icon">${icon('search')}</span><h2 class="g-h4">Nenhum módulo encontrado</h2><p class="g-body">Tente outro termo ou explore todos os módulos.</p><button class="g-btn" type="button" data-academy-clear>Limpar busca</button></div>`;
      $('[data-academy-clear]')?.addEventListener('click', () => { search='';filter='all';catalog();$('#g-academy-search').focus(); },{signal});
      mount($('[data-academy-rows]'));
    }
    function catalog() {
      main.innerHTML = `<header class="g-academy-head"><div><h2>Academia</h2><p>Encontre seu próximo aprendizado. Um módulo de cada vez.</p></div><div class="g-academy-tools"><span class="g-academy-total">${icon('book','g-icon--sm')} ${modules.length} módulos · ${totalLessons} aulas previstas</span><label class="g-academy-search">${icon('search','g-icon--sm')}<span class="g-academy-search-label">Buscar na Academia</span><input id="g-academy-search" type="search" placeholder="Buscar módulo ou aula…" value="${esc(search)}" autocomplete="off"></label></div></header>
        <div class="g-academy-controls"><div class="g-academy-filters" role="group" aria-label="Filtrar módulos"><button type="button" data-academy-filter="all" aria-pressed="${filter==='all'}">Todos os módulos</button>${groups.map(([key,label])=>`<button type="button" data-academy-filter="${key}" aria-pressed="${filter===key}">${label}</button>`).join('')}</div><p class="g-academy-results" data-academy-results role="status" aria-live="polite"></p></div>
        <p class="g-academy-notice">${icon('clock','g-icon--sm')}<span>A grade já pode ser explorada. Vídeos e materiais estão em preparação.</span></p><div class="g-academy-rows" data-academy-rows></div>`;
      $('#g-academy-search').addEventListener('input', event => { search=event.target.value; drawRows(); }, {signal});
      main.querySelectorAll('[data-academy-filter]').forEach(button => button.addEventListener('click', () => { filter=button.dataset.academyFilter;main.querySelectorAll('[data-academy-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button))); drawRows(); }, {signal}));
      drawRows(); mount(main);
    }
    function detail(entry, lessonId) {
      const { course, module, art:index }=entry;
      lastModuleId = module.id;
      main.innerHTML = `<nav class="g-academy-breadcrumb" aria-label="Caminho do módulo"><a href="#${encodeURIComponent(course.id)}">${icon('arrow-left','g-icon--sm')} Todos os módulos</a><span aria-hidden="true">/</span><span>Módulo ${String(module.number).padStart(2,'0')}</span></nav>
        <section class="g-academy-module-hero" aria-labelledby="g-academy-module-title"><div class="g-academy-module-art">${art(index)}</div><div class="g-academy-module-intro"><span class="g-academy-module-status">${icon('clock','g-icon--sm')} Em preparação</span><p class="g-academy-kicker">${esc(course.name)} · ${esc(module.level)}</p><h2 id="g-academy-module-title" tabindex="-1">${esc(module.title)}</h2><p class="g-body">${esc(module.objective)}</p><div class="g-academy-module-meta"><span>${module.lessons.length} aulas previstas</span><span>${duration(moduleDuration(module))} estimados</span></div><a class="g-btn" href="#${encodeURIComponent(module.id)}-aulas">Explorar a grade ${icon('arrow-down','g-icon--sm')}</a></div></section>
        <div class="g-academy-detail-grid"><section aria-labelledby="${esc(module.id)}-aulas"><div class="g-academy-shelf-head"><div><h3 id="${esc(module.id)}-aulas">Neste módulo</h3><p>Consulte o conteúdo e os materiais previstos para cada aula.</p></div><span>${module.lessons.length} aulas</span></div><ol class="g-academy-lessons" start="${module.lessons[0]?.number||1}">${module.lessons.map(lesson=>`<li><details id="${esc(lesson.id)}"${lesson.id===lessonId?' open':''}><summary><span class="g-academy-lesson-number">${String(lesson.number).padStart(2,'0')}</span><span class="g-academy-lesson-title">${esc(lesson.title)}<small>${lesson.durationMinutes} min estimados · Em preparação</small></span>${icon('chevron-down','g-icon--sm')}</summary><div class="g-academy-lesson-body"><p class="g-body">${esc(lesson.text)}</p><p class="g-academy-material"><b>Material previsto</b><span>${esc(lesson.material)}</span></p></div></details></li>`).join('')}</ol></section><aside class="g-academy-detail-aside"><h3 class="g-h4">Aprenda no seu ritmo</h3><p class="g-body">A grade está planejada. As aulas e os materiais serão apresentados aqui quando estiverem disponíveis.</p><p class="g-caption">${esc(course.notice)}</p><a href="#${encodeURIComponent(course.id)}">Ver outros módulos ${icon('arrow-right','g-icon--sm')}</a></aside></div>${about(course)}`;
      mount(main);
      $('#g-academy-module-title').focus({preventScroll:true});
      if (lessonId) document.getElementById(lessonId)?.scrollIntoView({block:'center'});
      else main.scrollIntoView({block:'start'});
    }
    function route() {
      let id; try { id=decodeURIComponent(location.hash.slice(1)); } catch { id=''; }
      const module = modules.find(entry=>entry.module.id===id || entry.module.id+'-aulas'===id || entry.module.lessons.some(lesson=>lesson.id===id));
      if (module) {
        detail(module, module.module.lessons.find(lesson=>lesson.id===id)?.id);
        if (id.endsWith('-aulas')) document.getElementById(id)?.scrollIntoView({block:'start'});
      } else {
        catalog();
        let returning = false;
        if (lastModuleId) {
          const trigger = [...main.querySelectorAll('.g-academy-card')].find(card => card.getAttribute('href') === '#' + encodeURIComponent(lastModuleId));
          trigger?.focus();
          returning = !!trigger;
          lastModuleId = '';
        }
        const target = document.getElementById(id);
        if (target && !returning) { const disclosure=target.closest('details'); if(disclosure)disclosure.open=true; target.scrollIntoView({block:'start'}); }
        else if(!returning)main.scrollIntoView({block:'start'});
      }
    }
    window.addEventListener('hashchange',route,{signal});
    route(); main.setAttribute('aria-busy','false');
  }
  window.GRAAO_ACADEMY={render};
})();
