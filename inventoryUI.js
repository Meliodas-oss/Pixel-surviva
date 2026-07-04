(function(){
'use strict'; const PS=window.PS;
class InventoryUI{
  constructor(engine){this.engine=engine;document.getElementById('openInv').onclick=()=>this.toggle();}
  toggle(){const p=document.getElementById('panel');if(!p.classList.contains('hidden')&&p.dataset.kind==='inventory'){p.classList.add('hidden');return;}p.dataset.kind='inventory';p.classList.remove('hidden');this.render();}
  render(){const panel=document.getElementById('panel');if(panel.dataset.kind!=='inventory')return;const inv=this.engine.systems.inventory;let html='<h2>🎒 Inventory</h2><p>Grid inventory, hotbar 1-9, drag & drop, equipment, weight system.</p>';html+='<h3>Equipment</h3><div class="grid">';for(const [slot,s] of Object.entries(inv.equipment)){const it=s?PS.Items[s.id]:null;html+=`<div class="slot"><b>${slot}</b><span>${it?it.icon+' '+it.name:'empty'}</span></div>`;}html+='</div><h3>Backpack</h3><div class="grid">';inv.slots.forEach((s,i)=>{const it=s?PS.Items[s.id]:null;html+=`<div class="slot" draggable="true" data-slot="${i}"><b>${it?it.icon+' '+it.name:''}</b><span>${s?'x'+s.count:''}</span><small>${it?it.rarity:''}</small></div>`;});html+='</div><div class="toolbar"><button onclick="PS.app.systems.inventory.useHotbar()">Use Hotbar</button><button onclick="PS.app.systems.save.save(0)">Save Slot 1</button><button onclick="PS.app.systems.save.load(0)">Load Slot 1</button></div>';panel.innerHTML=html;panel.querySelectorAll('.slot[data-slot]').forEach(el=>{el.ondblclick=()=>inv.useSlot(+el.dataset.slot);el.ondragstart=()=>{inv.dragIndex=+el.dataset.slot;el.classList.add('dragging');};el.ondragend=()=>el.classList.remove('dragging');el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();inv.move(inv.dragIndex,+el.dataset.slot);};});}
}
PS.InventoryUI=InventoryUI;
})();
