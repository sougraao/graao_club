/* Isolated pilot: no authentication, API calls or product data mutations. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const storageKey = 'graao:glass-pop:tasks:v2';
  let tasks = [];
  try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(value)) tasks = value.filter(t => t && typeof t.text === 'string').slice(0,100).map(t => ({ text:t.text.slice(0,120), done:t.done === true })); } catch { $('g-pop-storage').textContent = 'Armazenamento indisponível. A demonstração funciona nesta sessão.'; }
  const save = () => { try { localStorage.setItem(storageKey,JSON.stringify(tasks)); } catch { $('g-pop-storage').textContent = 'Não foi possível salvar. As ações permanecem nesta sessão.'; } };
  function render() {
    const list = $('g-pop-tasks'); list.replaceChildren();
    if (!tasks.length) { const p=document.createElement('p'); p.className='g-pop-note'; p.textContent='Seu plano começa com uma ação pequena. Adicione a primeira ao lado.'; list.append(p); }
    tasks.forEach((task,index) => {
      const row=document.createElement('div'); row.className='g-pop-task';
      const check=document.createElement('input'); check.type='checkbox'; check.checked=task.done; check.setAttribute('aria-label','Concluir: '+task.text);
      check.addEventListener('change',()=>{ task.done=check.checked; save(); render(); list.querySelectorAll('input')[index]?.focus(); });
      const text=document.createElement('span'); text.textContent=task.text;
      const remove=document.createElement('button'); remove.type='button'; remove.className='g-icon-btn'; remove.textContent='×'; remove.setAttribute('aria-label','Remover: '+task.text);
      remove.addEventListener('click',e=>{e.preventDefault(); const removed=tasks.splice(index,1)[0]; save(); render(); G.toast('Ação removida',{action:'Desfazer',duration:12000,onAction:()=>{tasks.splice(index,0,removed);save();render();}}); $('g-pop-input').focus();});
      row.append(check,text,remove); list.append(row);
    });
    $('g-pop-progress').textContent=`${tasks.filter(t=>t.done).length} de ${tasks.length} concluídas`;
    G.mount(list);
  }
  $('g-pop-form').addEventListener('submit',event=>{event.preventDefault();const input=$('g-pop-input'); const text=input.value.trim(); if(!text){ input.setCustomValidity('Descreva uma ação para continuar.');input.reportValidity();return;} if(tasks.length>=100){G.toast('Limite de 100 ações nesta demonstração.');return;} tasks.push({text,done:false});save();render();input.value='';input.focus();});
  $('g-pop-input').addEventListener('input',event=>event.target.setCustomValidity(''));
  $('g-pop-theme').addEventListener('change',event=>{const theme=event.target.value; if(theme==='high-contrast')document.documentElement.dataset.theme=theme;else G.theme(theme);});
  $('g-pop-motion').checked=G.motion.current()==='reduce'; $('g-pop-motion').addEventListener('change',event=>G.motion(event.target.checked?'reduce':'auto'));
  document.querySelectorAll('[data-g-pop-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-g-pop-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button))); let count=0;document.querySelectorAll('[data-g-pop-category]').forEach(card=>{card.hidden=button.dataset.gPopFilter!=='all'&&card.dataset.gPopCategory!==button.dataset.gPopFilter;if(!card.hidden)count++;});$('g-pop-results').textContent=`${count} ${count===1?'item':'itens'} na biblioteca`;}));
  const dialog=$('g-pop-lightbox'); $('g-pop-open').addEventListener('click',()=>dialog.showModal()); dialog.addEventListener('click',e=>{if(e.target===dialog&& (e.clientX<dialog.getBoundingClientRect().left || e.clientX>dialog.getBoundingClientRect().right))dialog.close();});
  render();
})();
