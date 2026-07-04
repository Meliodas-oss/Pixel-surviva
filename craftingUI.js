(function(){
'use strict'; const PS=window.PS;
class CraftingUI{
  constructor(engine){this.engine=engine;this.category='all';document.getElementById('openCraft').onclick=()=>this.toggle();}
  toggle(){const p=document.getElementById('panel');if(!p.classList.contains('hidden')&&p.dataset.kind==='craft'){p.classList.add('hidden');return;}p.dataset.kind='craft';p.classList.remove('hidden');this.render();}
  render(){const panel=document.getElementById('panel');if(panel.dataset.kind!=='craft')return;const craft=this.engine.systems.crafting;const inv=this.engine.systems.inventory;const cats=['all','tools','weapons','armor','buildings','food'];let html=`<h2>🔨 Crafting</h2><p>Deep recipe tree, station upgrades, furnace/anvil tiers, discovery system and auto-craft toggle.</p><div class="toolbar">${cats.map(c=>`<button onclick="PS.app.ui.craftingUI.category='${c}';PS.app.ui.craftingUI.render()">${c}</button>`).join('')}<button onclick="PS.app.systems.crafting.auto=!PS.app.systems.crafting.auto">Auto: ${craft.auto?'ON':'OFF'}</button></div>`;for(const st of ['hand','workbench','furnace','anvil']){html+=`<h3>${st}</h3>`;PS.Recipes.filter(r=>(this.category==='all'||r.cat===this.category)&&r.station===st).forEach(r=>{const it=PS.Items[r.out],dis=craft.discovered.has(r.id),can=craft.can(r);html+=`<div class="card ${can?'can':''}"><div class="row"><b>${it.icon} ${r.count}x ${it.name}</b><button ${!can?'disabled':''} onclick="PS.app.systems.crafting.craft('${r.id}')">Craft</button></div><p class="muted">${dis?Object.entries(r.req).map(([k,v])=>(PS.Items[k]?.icon||'?')+' '+v+' '+(PS.Items[k]?.name||k)).join(', '):'Recipe undiscovered'}</p></div>`;});}panel.innerHTML=html;}
}
PS.CraftingUI=CraftingUI;
})();
