/* Explicit, memory-only fixture for inicio-preview.html. No API or persistent storage. */
(() => {
  'use strict';
  const project = { id:'preview-project',title:'Campanha de lançamento · demonstração',objective:'Organizar uma direção visual para apresentar ao cliente.',status:'ativo',is_main:true,orbita:'O',resume_note:'Separei as referências. O próximo passo é escolher três caminhos visuais.',updated_at:new Date().toISOString() };
  const steps = [{id:'preview-step-1',title:'Separar três referências de tipografia',done:false,is_next:true,orbita:'O',position:0},{id:'preview-step-2',title:'Organizar o briefing em uma página',done:true,is_next:false,orbita:'O',position:1}];
  const events = [{id:'preview-event',kind:'nota',text:'Demonstração: briefing organizado e referências separadas.',created_at:new Date().toISOString()}];
  const clone = value => JSON.parse(JSON.stringify(value));
  window.GRAAO_PROJECTS = {
    live:false,
    list:async()=>[clone(project)],
    steps:async()=>clone(steps),
    activity:async()=>clone(events),
    stats:async()=>({projects:1,delivered:0,stepsDone:steps.filter(s=>s.done).length}),
    updateStep:async(id,patch)=>{const step=steps.find(s=>s.id===id);if(!step)throw new Error('Ação não encontrada.');Object.assign(step,patch);if(step.done)step.is_next=false;return clone(step);},
    addStep:async(id,fields)=>{const step={id:'preview-step-'+(steps.length+1),done:false,position:steps.length,...fields};steps.push(step);return clone(step);},
    update:async(id,fields)=>{Object.assign(project,fields);return clone(project);},
  };
})();
